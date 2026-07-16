import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CompeleService } from '../../../services/compele.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresasfacturacion',
  templateUrl: './empresasfacturacion.component.html'
})
export class EmpresasfacturacionComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  empresas: any[] = [];
  empresasFiltradas: any[] = [];
  filtroNombre: string = '';
  
  cols: any[] = [];
  
  displayModal: boolean = false;
  empresaSeleccionada: any;
  archivoSeleccionado: File | null = null;
  claveFirma: string = '';
  confirmacionClave: string = '';
  math = Math;

  constructor(private compeleService: CompeleService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'emp_nombrecomercial', header: 'Nombre de la empresa' },
      { field: 'alm_tipoamb', header: 'Ambiente' },
      { field: 'estado_firma', header: 'Estado de la firma digital' }
    ];
    this.loadData();
  }

  loadData() {
    this.compeleService.getEmpsInfo().subscribe((res: any) => {
        if(res.status === 200) {
            this.empresas = res.infofactemps.map((emp: any) => {
                emp.estado_firma = this.getEstadoFirma(emp.ndias_caducidad);
                return emp;
            });
            this.filtrar();
        }
    });
  }

  getEstadoFirma(ndias: number) {
      if (ndias === null || ndias === undefined) return 'Desconocido';
      if(ndias <= 0) return 'Caducado';
      if(ndias >= 1 && ndias <= 7) return 'Próximo a caducar';
      return 'Vigente';
  }

  filtrar() {
      if(!this.filtroNombre || this.filtroNombre.trim() === '') {
          this.empresasFiltradas = [...this.empresas];
      } else {
          const fn = this.filtroNombre.toLowerCase();
          this.empresasFiltradas = this.empresas.filter(e => e.emp_nombrecomercial.toLowerCase().includes(fn));
      }
  }
  
  refrescar() {
      this.loadData();
  }

  abrirModalActualizar(empresa: any) {
      this.empresaSeleccionada = empresa;
      this.archivoSeleccionado = null;
      this.claveFirma = '';
      this.confirmacionClave = '';
      if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
      }
      this.displayModal = true;
  }

  onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
          if (!file.name.toLowerCase().endsWith('.p12')) {
              Swal.fire('Error', 'Solo se permiten archivos con extensión .p12', 'error');
              event.target.value = '';
              this.archivoSeleccionado = null;
              return;
          }
          if (file.size > 1048576) {
              Swal.fire('Error', 'El tamaño máximo del archivo es 1MB', 'error');
              event.target.value = '';
              this.archivoSeleccionado = null;
              return;
          }
          this.archivoSeleccionado = file;
      }
  }

  get isFormValido() {
      return this.archivoSeleccionado && 
             this.claveFirma && 
             this.confirmacionClave &&
             this.claveFirma === this.confirmacionClave &&
             this.claveFirma.length <= 50;
  }

  guardarFirma() {
      if (!this.isFormValido) return;

      Swal.fire({
          title: '¿Estás seguro?',
          text: "¡El cambio es irreversible!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              const reader = new FileReader();
              reader.readAsDataURL(this.archivoSeleccionado as Blob);
              reader.onload = () => {
                  let base64String = reader.result as string;
                  const base64Content = base64String.split(',')[1];
                  
                  this.compeleService.updateDigitalSign(this.empresaSeleccionada.emp_id, base64Content, this.claveFirma).subscribe((res: any) => {
                      if(res.status === 200) {
                          Swal.fire('Actualizado!', res.mensaje || 'La firma digital ha sido actualizada.', 'success');
                          this.displayModal = false;
                          this.loadData();
                      }
                  });
              };
              reader.onerror = (error) => {
                  Swal.fire('Error', 'No se pudo leer el archivo.', 'error');
              };
          }
      });
  }

  cancelar() {
      this.displayModal = false;
  }
}
