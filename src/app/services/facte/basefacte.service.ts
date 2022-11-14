import { BaseService } from "../base-service";

export class BaseFacteService extends BaseService {

    protected getHOT(pparams: any) {
        const token = this.localStrgServ.getFacteAuthToken();
        return {
            headers: {
                'x-authtoken': token
            },
            params: pparams
        };

    }

}