export class BaseComponent {

    public isResultOk(result) {
        return result?.status === 200;
    }
}
