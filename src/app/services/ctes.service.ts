import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CtesService {

    protected Actualizar = 'actualizar';
    protected AgpContratos = 'agp_contratos';
    protected AgpLecturas = 'agp_lecturas';
    protected AgpPagos = 'agp_pagos';
    protected AgpPagosMavil = 'AGP_PAGOSMAVIL';
    protected AgpCreaCont = 'AGP_CREACONT';
    protected AgpAdmLecto = 'AGP_ADMLECTO';
    protected AgpCobroAgua = 'AGP_COBROAGUA';
    protected AgpListaContra = 'AGP_LISTACONTRA';
    protected AgpListaLecto = 'AGP_LISTALECTO';
    protected Anulactacontab = 'anulactacontab';
    protected Anular = 'anular';
    protected Artid = 'art_id';
    protected ArtsAutoCom = 'artsAutoCom';
    protected Blank = '_blank';
    protected Borrar = 'borrar';
    protected Buscaci = 'buscaci';
    protected Buscacifull = 'buscacifull';
    protected BuscaInput = 'buscaInput';
    protected BuscaPacNomCiInput = 'buscaPacNomCiInput';
    protected Buscaporid = 'buscaporid';
    protected Buscaporidfull = 'buscaporidfull';
    protected Buscatipo = 'buscatipo';
    protected Changesec = 'changesec';
    protected Chgstate = 'chgstate';
    protected CodbarraInput = 'codbarraInput';
    protected Confirmar = 'confirmar';
    protected Conspend = 'conspend';
    protected Crea = 'crea';
    protected Creadoc = 'creadoc';
    protected Crear = 'crear';
    protected Creasiento = 'creasiento';
    protected Chkrol = 'chkrol';
    protected Del = 'del';
    protected Duplicar = 'duplicar';
    protected Editar = 'editar';
    protected Editasiento = 'editasiento';
    protected Error = 'error';
    protected FcSecuencia = 'fc_secuencia';
    protected FeaturesOpenNewWin = 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=800,height=600';
    protected Filtropag = 'filtropag';
    protected Findbynum = 'findbynum';
    protected Fmtfecha = 'dd/MM/yyyy';
    protected FmtfechaDb = 'yyyy-MM-dd';
    protected Form = 'form';
    protected Formasiento = 'formasiento';
    protected Formlista = 'formlista';
    protected Forml = 'forml';
    protected Formcab = 'formcab';
    protected Formcrea = 'formcrea';
    protected Formfiltrolibd = 'formfiltrolibd';
    protected Formfiltros = 'formfiltros';
    protected Formchangesec = 'formchangesec';
    protected Formpmavil = 'formpmavil';
    protected Filterbynum = 'filterbynum';
    protected Gallctascontables = 'gallctascontables';
    protected Gartsserv = 'gartsserv';
    protected Gbyref = 'gbyref';
    protected Gbycodmed = 'gbycodmed';
    protected Gcalpag = 'gcalpag';
    protected Gctascontables = 'gctascontables';
    protected Gcuentafacts = 'gcuentafacts';
    protected Gdetctacontable = 'gdetctacontable';
    protected Gdetdoc = 'gdetdoc';
    protected Gdetcred = 'gdetcred';
    protected Getasientos = 'getasientos';
    protected Getbalancegeneral = 'getbalancegeneral';
    protected Getcuentasbytipo = 'getcuentasbytipo';
    protected Getdatosasiconta = 'getdatosasiconta';
    protected Getdatosmov = 'getdatosmov';
    protected Getestadoresultados = 'getestadoresultados';
    protected Getformlibromayor = 'getformlibromayor';
    protected Getmovscta = 'getmovscta';
    protected Gettransaccs = 'gettransaccs';
    protected Gfact = 'gfact';
    protected Gformed = 'gformed';
    protected Gformplancta = 'gformplancta';
    protected Gimpuestos = 'gimpuestos';
    protected GlobalAsistPorcIncrePrecioCompra = 'globalAsistPorcIncrePrecioCompra';
    protected Gplanc = 'gplanc';
    protected Gridventas = 'gridventas';
    protected Grid = 'grid';
    protected Gridcontrantos = 'gridcontrantos';
    protected Gservdentall = 'gservdentall';
    protected Gtotaldeudas = 'gtotaldeudas';
    protected Guardaplancta = 'guardaplancta';
    protected Guardar = 'guardar';
    protected IcNota = 'ic_nota';
    protected InsertStock = 'insertStock';
    protected Last = 'last';
    protected Listar = 'listar';
    protected ListarGrid = 'listargrid';
    protected LmdId = 'lmd_id';
    protected Lmedicos = 'lmedicos';
    protected Mercaderia = 'mercaderia';
    protected MercaderiaForm = 'mercaderiaForm';
    protected MercaderiaView = 'mercaderiaView';
    protected MercformdefCat = 'mercformdef_cat';
    protected MercformdefProv = 'mercformdef_prov';
    protected MedAutoCom = 'medAutoCom';
    protected Monto = 'monto';
    protected MotivoConsultaTextArea = 'motivoConsultaTextArea';
    protected MsgConfirmChangeSec = '¿Confirma que desea realizar el cambio de sección?';
    protected MsgConfirmEditReg = '¿Confirma que desea editar este registro?';
    protected MsgConfirmNotaCred = '¿Confirma que desea emitir una nota de crédito por la totalidad de esta factura?'
    protected MsgConfirmSave = '¿Confirma que desea registrar la información ingresada?';
    protected MsgDataIncompleteRef = 'Datos incompletos del referente, favor completar';
    protected MsgDatosIncorr = 'Datos Incorrectos';
    protected MsgEditingFact = 'Editando comprobante';
    protected MsgTipoArchivoNoAdm = 'Este tipo de archivo no esta admitido';
    protected MsgTamanioArchivo = 'El tamaño del archivo es muy grande, elija otro (Tamaño máximo 10MB)';
    protected MsgEnterCatName = 'Ingrese el nombre de la categoría';
    protected MsgFactIsCredMustEnterRef = 'Factura a crédito, se debe especificar el referente';
    protected MsgMontoIncVerif = 'Monto incorrecto, favor verificar';
    protected MsgMustAddProdInFact = 'Debe agregar productos o servicios a la factura';
    protected MsgMustEnterCodBarra = 'Debe ingresar el nuevo código de barra';
    protected MsgMustEnterDataRef = 'Debe ingresar los datos del referente';
    protected MsgMustEnterDateFact = 'Debe especificar la fecha de la factura';
    protected MsgMustEnterFechaNac = 'Debe especificar la fecha de nacimiento del referente';
    protected MsgMustEnterNumFact = 'Debe ingresar el número de la factura';
    protected MsgMustSelectEstCivRef = 'Debe seleccionar el estado civil del referente';
    protected MsgMustSelectGenRef = 'Debe seleccionar el genero del referente';
    protected MsgMustSelectModContab = 'Debe seleccionar el modelo contable';
    protected MsgMustSelectSeccion = 'Debe seleccionar al menos una sección para este producto/servicio';
    protected MsgNewRefEnterDataFil = 'Nuevo paciente, debe ingresar los datos de filiación';
    protected MsgRefRegistered = 'Referente registrado';
    protected MsgSureSaveFact = '¿Seguro que desea guardar el comprobante?';
    protected MsgSureWishAnulRecord = '¿Seguro que desea anular este registro?';
    protected MsgSureWishRemoveRecord = '¿Seguro que desea eliminar este registro?';
    protected MsgSureWishEditRecord = '¿Seguro que desea editar este registro?';
    protected MsgSureWishRemoveCat = '¿Seguro que desea anular esta categoría?';
    protected MsgSureWishRemveItemFact = '¿Seguro que desea quitar este item de la factura?';
    protected MsgVerifInfo = 'Verifique la información ingresada';
    protected MsgWishPrint = '¿Desea imprimir?';
    protected NombreInput = 'nombreInput';
    protected NumbersPattern = '^[0-9]*\\.*[0-9]*$';
    protected PerCiruc = 'per_ciruc';
    protected PerCirucInput = 'perCirucInput';
    protected PerNombres = 'per_nombres';
    protected PerNombresInput = 'perNombresInput';
    protected PorcIncAsistPre = 'porcIncAsistPre';
    protected PrecioCompraInput = 'precioCompraInput';
    protected PrecioVentaInput = 'precioVentaInput';
    protected Previous = 'previous';
    protected RefAutoCom = 'refAutoCom';
    protected Registra = 'registra';
    protected Repagmavil = 'repagmavil';
    protected Reporte = 'reporte';
    protected Saverepagmavil = 'saverepagmavil';
    protected Seccodbarra = 'seccodbarra';
    protected Setseccion = 'setseccion';
    protected Servticktes = 'servticktes';
    protected Stock = 'stock';
    protected TablaAmor = 'tblamor';
    protected Trncoded = 'trncoded';
    protected True = 'true';
    protected Updatecode = 'updatecode';
    protected UrlTomcat = environment.tomcat;
    protected Verifcodbar = 'verifcodbar';

    get _blank() {
        return this.Blank;
    }

    get filterbynum() {
        return this.Filterbynum;
    }

    get agp_contratos() {
        return this.AgpContratos;
    }

    get agp_lecturas() {
        return this.AgpLecturas;
    }

    get agp_pagos() {
        return this.AgpPagos;
    }

    get agp_pagosmavil() {
        return this.AgpPagosMavil;
    }

    get agp_creacont() {
        return this.AgpCreaCont;
    }

    get agp_admlecto() {
        return this.AgpAdmLecto;
    }

    get agp_cobroagua() {
        return this.AgpCobroAgua;
    }

    get agp_listacontra() {
        return this.AgpListaContra;
    }

    get agp_listalecto() {
        return this.AgpListaLecto;
    }

    get actualizar() {
        return this.Actualizar;
    }

    get grid() {
        return this.Grid;
    }

    get gridcontrantos() {
        return this.Gridcontrantos;
    }

    get anulactacontab() {
        return this.Anulactacontab;
    }

    get anular() {
        return this.Anular;
    }

    get art_id() {
        return this.Artid;
    }

    get artsAutoCom() {
        return this.ArtsAutoCom;
    }

    get bgyref() {
        return this.Gbyref;
    }

    get gbycodmed() {
        return this.Gbycodmed;
    }

    get borrar() {
        return this.Borrar;
    }

    get buscaci() {
        return this.Buscaci;
    }

    get buscacifull() {
        return this.Buscacifull;
    }

    get buscaInput() {
        return this.BuscaInput;
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

    get chkrol() {
        return this.Chkrol;
    }

    get changesec() {
        return this.Changesec;
    }

    get chgstate() {
        return this.Chgstate;
    }

    get codbarraInput() {
        return this.CodbarraInput;
    }

    get confirmar() {
        return this.Confirmar;
    }

    get conspend() {
        return this.Conspend;
    }

    get crea() {
        return this.Crea;
    }

    get creadoc() {
        return this.Creadoc;
    }

    get crear() {
        return this.Crear;
    }

    get creasiento() {
        return this.Creasiento;
    }

    get del() {
        return this.Del;
    }

    get duplicar() {
        return this.Duplicar;
    }

    get editar() {
        return this.Editar;
    }

    get editasiento() {
        return this.Editasiento;
    }

    get error() {
        return this.Error;
    }

    get fc_secuencia() {
        return this.FcSecuencia;
    }

    get featuresOpenNewWin() {
        return this.FeaturesOpenNewWin;
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

    get fmtfechaDb() {
        return this.FmtfechaDb;
    }

    get form() {
        return this.Form;
    }

    get formasiento() {
        return this.Formasiento;
    }

    get forml() {
        return this.Forml;
    }

    get formlista() {
        return this.Formlista;
    }

    get formcab() {
        return this.Formcab;
    }

    get formcrea() {
        return this.Formcrea;
    }

    get formfiltrolibd() {
        return this.Formfiltrolibd;
    }

    get formfiltros() {
        return this.Formfiltros;
    }

    get formchangesec() {
        return this.Formchangesec;
    }

    get formpmavil() {
        return this.Formpmavil;
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

    get gdetdoc() {
        return this.Gdetdoc;
    }

    get gdetcred() {
        return this.Gdetcred;
    }

    get getasientos() {
        return this.Getasientos;
    }

    get getbalancegeneral() {
        return this.Getbalancegeneral;
    }

    get getcuentasbytipo() {
        return this.Getcuentasbytipo;
    }

    get getdatosasiconta() {
        return this.Getdatosasiconta;
    }

    get getdatosmov() {
        return this.Getdatosmov;
    }

    get getestadoresultados() {
        return this.Getestadoresultados;
    }

    get getformlibromayor() {
        return this.Getformlibromayor;
    }

    get getmovscta() {
        return this.Getmovscta;
    }

    get gettransaccs() {
        return this.Gettransaccs;
    }

    get gfact() {
        return this.Gfact;
    }

    get gformed() {
        return this.Gformed;
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

    get gridventas() {
        return this.Gridventas;
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

    get guardar() {
        return this.Guardar;
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

    get mercaderiaView() {
        return this.MercaderiaView;
    }

    get mercformdef_cat() {
        return this.MercformdefCat;
    }

    get mercformdef_prov() {
        return this.MercformdefProv;
    }

    get medAutoCom() {
        return this.MedAutoCom;
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

    get msgTamanioArchivo() {
        return this.MsgTamanioArchivo;
    }

    get msgEditingFact() {
        return this.MsgEditingFact;
    }

    get msgTipoArchivoNoAdm(){
        return this.MsgTipoArchivoNoAdm
    }

    get msgEnterCatName() {
        return this.MsgEnterCatName;
    }

    get msgFactIsCredMustEnterRef() {
        return this.MsgFactIsCredMustEnterRef;
    }

    get msgMontoIncVerif() {
        return this.MsgMontoIncVerif;
    }

    get msgMustAddProdInFact() {
        return this.MsgMustAddProdInFact;
    }

    get msgConfirmChangeSec() {
        return this.MsgConfirmChangeSec;
    }

    get msgConfirmEditReg(){
        return this.MsgConfirmEditReg;
    }

    get msgConfirmNotaCred(){
        return this.MsgConfirmNotaCred;
    }

    get msgMustEnterCodBarra() {
        return this.MsgMustEnterCodBarra;
    }

    get msgMustEnterDataRef() {
        return this.MsgMustEnterDataRef;
    }

    get msgMustEnterDateFact() {
        return this.MsgMustEnterDateFact;
    }

    get msgMustEnterFechaNac() {
        return this.MsgMustEnterFechaNac;
    }

    get msgMustEnterNumFact() {
        return this.MsgMustEnterNumFact;
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

    get msgSureSaveFact() {
        return this.MsgSureSaveFact;
    }

    get msgSureWishRemoveRecord() {
        return this.MsgSureWishRemoveRecord;
    }

    get msgSureWishAnulRecord() {
        return this.MsgSureWishAnulRecord;
    }

    get msgSureWishEditRecord() {
        return this.MsgSureWishEditRecord;
    }

    get msgSureWishRemoveCat() {
        return this.MsgSureWishRemoveCat;
    }

    get msgSureWishRemveItemFact() {
        return this.MsgSureWishRemveItemFact;
    }

    get msgVerifInfo() {
        return this.MsgVerifInfo;
    }

    get msgWishPrint() {
        return this.MsgWishPrint;
    }

    get nombreInput() {
        return this.NombreInput;
    }

    get numbersPattern() {
        return this.NumbersPattern;
    }

    get per_ciruc() {
        return this.PerCiruc;
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

    get previous() {
        return this.Previous;
    }

    get refAutoCom() {
        return this.RefAutoCom;
    }

    get registra() {
        return this.Registra;
    }

    get repagmavil() {
        return this.Repagmavil;
    }

    get reporte() {
        return this.Reporte;
    }

    get saverepagmavil() {
        return this.Saverepagmavil;
    }

    get seccodbarra() {
        return this.Seccodbarra;
    }

    get setseccion() {
        return this.Setseccion;
    }

    get servticktes() {
        return this.Servticktes;
    }

    get stock() {
        return this.Stock;
    }

    get tablaAmor() {
        return this.TablaAmor;
    }

    get trncoded() {
        return this.Trncoded;
    }

    get true() {
        return this.True;
    }

    get updatecode() {
        return this.Updatecode;
    }

    get urlTomcat() {
        return this.UrlTomcat;
    }

    get verifcodbar() {
        return this.Verifcodbar;
    }


}
