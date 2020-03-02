export interface ContribListResponse {
  estado: number;
  items: Array<any>;
  cols: Array<any>;
}

/*export interface FindByRucResponse {
  estado: number;
  contrib: any;
}*/

export interface TipoContrib {
  cls_id: number;
  cls_nombre: string;
}

export interface ContribFormResponse {
  estado: number;
  form: any;
  tiposcontrib: Array<TipoContrib>;
}


export interface DefaultRestResponse {
  estado: number;
  msg: string;
}

export interface NewContribForm {
  cnt_id: number;
  cnt_ruc: string;
  cnt_razonsocial: string;
  cnt_nombrecomercial: string;
  cnt_telf: string;
  cnt_email: string;
  cnt_dirmatriz: string;
  cnt_clase: number;
  cls_nombre: string;
  cnt_nrocntespecial: string;
  cnt_oblcontab: number;
  ocontab: string;
}

export interface UserDataSession {
  token: string;
  emp_codigo: number;
  emp_esquema: string;
  user_id: number;
}

