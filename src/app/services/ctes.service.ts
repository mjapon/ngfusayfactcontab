import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CtesService {

    protected Anulactacontab = 'anulactacontab';
    protected Anular = 'anular';
    protected Artid = 'art_id';
    protected Buscaci = 'buscaci';
    protected Buscacifull = 'buscacifull';
    protected BuscaPacNomCiInput = 'buscaPacNomCiInput';
    protected Buscaporid = 'buscaporid';
    protected Buscaporidfull = 'buscaporidfull';
    protected Buscatipo = 'buscatipo';
    protected CodbarraInput = 'codbarraInput';
    protected Conspend = 'conspend';
    protected Crea = 'crea';
    protected Crear = 'crear';
    protected Confirmar = 'confirmar';
    protected Del = 'del';
    protected Error = 'error';
    protected Filtropag = 'filtropag';
    protected Findbynum = 'findbynum';
    protected Fmtfecha = 'dd/MM/yyyy';
    protected Form = 'form';
    protected Formcrea = 'formcrea';
    protected Formfiltros = 'formfiltros';
    protected Gallctascontables = 'gallctascontables';
    protected Gartsserv = 'gartsserv';
    protected Gbyref = 'gbyref';
    protected Gcalpag = 'gcalpag';
    protected Gctascontables = 'gctascontables';
    protected Gcuentafacts = 'gcuentafacts';
    protected Gdetctacontable = 'gdetctacontable';
    protected Getcuentasbytipo = 'getcuentasbytipo';
    protected Getdatosmov = 'getdatosmov';
    protected Gformplancta = 'gformplancta';
    protected Gimpuestos = 'gimpuestos';
    protected GlobalAsistPorcIncrePrecioCompra = 'globalAsistPorcIncrePrecioCompra';
    protected Gplanc = 'gplanc';
    protected Gservdentall = 'gservdentall';
    protected Gtotaldeudas = 'gtotaldeudas';
    protected Guardaplancta = 'guardaplancta';
    protected IcNota = 'ic_nota';
    protected InsertStock = 'insertStock';
    protected Last = 'last';
    protected Listar = 'listar';
    protected ListarGrid = 'listargrid';
    protected LmdId = 'lmd_id';
    protected Lmedicos = 'lmedicos';
    protected Mercaderia = 'mercaderia';
    protected MercaderiaForm = 'mercaderiaForm';
    protected MercformdefCat = 'mercformdef_cat';
    protected MercformdefProv = 'mercformdef_prov';
    protected Monto = 'monto';
    protected MotivoConsultaTextArea = 'motivoConsultaTextArea';
    protected MsgConfirmSave = '¿Confirma que desea registrar la información ingresada?';
    protected MsgDataIncompleteRef = 'Datos incompletos del referente, favor completar';
    protected MsgDatosIncorr = 'Datos Incorrectos';
    protected MsgEnterCatName = 'Ingrese el nombre de la categoría';
    protected MsgMontoIncVerif = 'Monto incorrecto, favor verificar';
    protected MsgMustEnterCodBarra = 'Debe ingresar el nuevo código de barra';
    protected MsgMustEnterFechaNac = 'Debe especificar la fecha de nacimiento del referente';
    protected MsgMustSelectEstCivRef = 'Debe seleccionar el estado civil del referente';
    protected MsgMustSelectGenRef = 'Debe seleccionar el genero del referente';
    protected MsgMustSelectModContab = 'Debe seleccionar el modelo contable';
    protected MsgMustSelectSeccion = 'Debe seleccionar al menos una sección para este producto/servicio';
    protected MsgNewRefEnterDataFil = 'Nuevo paciente, debe ingresar los datos de filiación';
    protected MsgRefRegistered = 'Referente registrado';
    protected MsgVerifInfo = 'Verifique la información ingresada';
    protected NombreInput = 'nombreInput';
    protected PerCirucInput = 'perCirucInput';
    protected PerNombres = 'per_nombres';
    protected PerNombresInput = 'perNombresInput';
    protected PorcIncAsistPre = 'porcIncAsistPre';
    protected PrecioCompraInput = 'precioCompraInput';
    protected PrecioVentaInput = 'precioVentaInput';
    protected RefAutoCom = 'refAutoCom';
    protected Seccodbarra = 'seccodbarra';
    protected Stock = 'stock';
    protected True = 'true';
    protected Updatecode = 'updatecode';
    protected Verifcodbar = 'verifcodbar';


    get anulactacontab() {
        return this.Anulactacontab;
    }

    get anular() {
        return this.Anular;
    }

    get art_id() {
        return this.Artid;
    }

    get confirmar() {
        return this.Confirmar;
    }

    get getdatosmov() {
        return this.Getdatosmov;
    }

    get getcuentasbytipo() {
        return this.Getcuentasbytipo;
    }

    get bgyref() {
        return this.Gbyref;
    }

    get buscaci() {
        return this.Buscaci;
    }

    get buscacifull() {
        return this.Buscacifull;
    }

    get buscaPacNomCiInput() {
        return this.BuscaPacNomCiInput;
    }

    get buscaporid() {
        return this.Buscaporid;
    }

    get buscaporidfull() {
        return this.Buscaporidfull;
    }

    get buscatipo() {
        return this.Buscatipo;
    }

    get codbarraInput() {
        return this.CodbarraInput;
    }

    get conspend() {
        return this.Conspend;
    }

    get crea() {
        return this.Crea;
    }

    get crear() {
        return this.Crear;
    }

    get del() {
        return this.Del;
    }

    get error() {
        return this.Error;
    }

    get filtropag() {
        return this.Filtropag;
    }

    get findbynum() {
        return this.Findbynum;
    }

    get fmtfecha() {
        return this.Fmtfecha;
    }

    get form() {
        return this.Form;
    }

    get formcrea() {
        return this.Formcrea;
    }

    get formfiltros() {
        return this.Formfiltros;
    }

    get gallctascontables() {
        return this.Gallctascontables;
    }

    get gartsserv() {
        return this.Gartsserv;
    }

    get gcalpag() {
        return this.Gcalpag;
    }

    get gctascontables() {
        return this.Gctascontables;
    }

    get gcuentafacts() {
        return this.Gcuentafacts;
    }

    get gdetctacontable() {
        return this.Gdetctacontable;
    }

    get gformplancta() {
        return this.Gformplancta;
    }

    get gimpuestos() {
        return this.Gimpuestos;
    }

    get globalAsistPorcIncrePrecioCompra() {
        return this.GlobalAsistPorcIncrePrecioCompra;
    }

    get gplanc() {
        return this.Gplanc;
    }

    get gservdentall() {
        return this.Gservdentall;
    }

    get gtotaldeudas() {
        return this.Gtotaldeudas;
    }

    get guardaplancta() {
        return this.Guardaplancta;
    }

    get ic_nota() {
        return this.IcNota;
    }

    get insertStock() {
        return this.InsertStock;
    }

    get last() {
        return this.Last;
    }

    get listar() {
        return this.Listar;
    }

    get listargrid() {
        return this.ListarGrid;
    }

    get lmd_id() {
        return this.LmdId;
    }

    get lmedicos() {
        return this.Lmedicos;
    }

    get mercaderia() {
        return this.Mercaderia;
    }

    get mercaderiaForm() {
        return this.MercaderiaForm;
    }

    get mercformdef_cat() {
        return this.MercformdefCat;
    }

    get mercformdef_prov() {
        return this.MercformdefProv;
    }

    get monto() {
        return this.Monto;
    }

    get motivoConsultaTextArea() {
        return this.MotivoConsultaTextArea;
    }

    get msgConfirmSave() {
        return this.MsgConfirmSave;
    }

    get msgDataIncompleteRef() {
        return this.MsgDataIncompleteRef;
    }

    get msgDatosIncorr() {
        return this.MsgDatosIncorr;
    }

    get msgEnterCatName() {
        return this.MsgEnterCatName;
    }

    get msgMontoIncVerif() {
        return this.MsgMontoIncVerif;
    }

    get msgMustEnterCodBarra() {
        return this.MsgMustEnterCodBarra;
    }

    get msgMustEnterFechaNac() {
        return this.MsgMustEnterFechaNac;
    }

    get msgMustSelectEstCivRef() {
        return this.MsgMustSelectEstCivRef;
    }

    get msgMustSelectGenRef() {
        return this.MsgMustSelectGenRef;
    }

    get msgMustSelectModContab() {
        return this.MsgMustSelectModContab;
    }

    get msgMustSelectSeccion() {
        return this.MsgMustSelectSeccion;
    }

    get msgNewRefEnterDataFil() {
        return this.MsgNewRefEnterDataFil;
    }

    get msgRefRegistered() {
        return this.MsgRefRegistered;
    }

    get msgVerifInfo() {
        return this.MsgVerifInfo;
    }

    get nombreInput() {
        return this.NombreInput;
    }

    get per_nombres() {
        return this.PerNombres;
    }

    get perCirucInput() {
        return this.PerCirucInput;
    }

    get perNombresInput() {
        return this.PerNombresInput;
    }

    get porcIncAsistPre() {
        return this.PorcIncAsistPre;
    }

    get precioCompraInput() {
        return this.PrecioCompraInput;
    }

    get precioVentaInput() {
        return this.PrecioVentaInput;
    }

    get refAutoCom() {
        return this.RefAutoCom;
    }

    get seccodbarra() {
        return this.Seccodbarra;
    }

    get stock() {
        return this.Stock;
    }

    get true() {
        return this.True;
    }

    get updatecode() {
        return this.Updatecode;
    }

    get verifcodbar() {
        return this.Verifcodbar;
    }


}
