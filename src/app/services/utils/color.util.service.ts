import {Injectable} from '@angular/core';

/**
 * Servicio para utilidades de color
 * Proporciona métodos para determinar colores de texto óptimos
 */
@Injectable({
    providedIn: 'root'
})
export class ColorUtilsService {

    /**
     * Convierte un color hexadecimal a RGB
     * @param hex - Color en formato hexadecimal (#ffffff o fff)
     * @returns Objeto con valores RGB o null si el formato es inválido
     */
    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        // Remover el # si existe
        hex = hex.replace('#', '');

        // Manejar formato corto (#fff -> #ffffff)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        if (hex.length !== 6) {
            return null;
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return {r, g, b};
    }

    /**
     * Determina el mejor color de texto basado en el color de fondo
     * Usa una fórmula simple de luminancia percibida
     * @param backgroundColor - Color de fondo en formato hexadecimal (#ffffff) o nombre CSS
     * @param lightTextColor - Color de texto claro (opcional, default: '#ffffff')
     * @param darkTextColor - Color de texto oscuro (opcional, default: '#333333')
     * @returns El color de texto recomendado en formato hexadecimal
     */
    getTextColorSimple(
        backgroundColor: string,
        lightTextColor: string = '#ffffff',
        darkTextColor: string = '#333333'
    ): string {
        try {
            // Convertir nombre de color a hex si es necesario
            // Convertir a RGB
            const rgb = this.hexToRgb(backgroundColor);

            if (!rgb) {
                console.warn(`ColorUtilsService: Color inválido '${backgroundColor}'. Usando texto oscuro por defecto.`);
                return darkTextColor;
            }

            // Fórmula de luminancia percibida (ITU-R BT.709)
            // Los coeficientes representan la sensibilidad del ojo humano a cada color
            const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

            // Si la luminancia es mayor a 0.5, usar texto oscuro, sino texto claro
            return luminance > 0.5 ? darkTextColor : lightTextColor;

        } catch (error) {
            console.error('ColorUtilsService: Error procesando color:', error);
            return darkTextColor;
        }
    }

    /**
     * Genera estilos CSS para un elemento con color de fondo y texto óptimo
     * @param backgroundColor - Color de fondo
     * @param options - Opciones adicionales de estilo
     * @returns Objeto con estilos CSS
     */
    generateStyles(
        backgroundColor: string,
        options: {
            lightText?: string;
            darkText?: string;
            padding?: string;
            borderRadius?: string;
        } = {}
    ): { [key: string]: string } {
        const {
            lightText = '#ffffff',
            darkText = '#333333',
            padding,
            borderRadius
        } = options;

        const textColor = this.getTextColorSimple(backgroundColor, lightText, darkText);

        const styles: { [key: string]: string } = {
            'background-color': backgroundColor,
            color: textColor
        };

        if (padding) {
            styles['padding'] = padding;
        }

        if (borderRadius) {
            styles['border-radius'] = borderRadius;
        }

        return styles;
    }
}
