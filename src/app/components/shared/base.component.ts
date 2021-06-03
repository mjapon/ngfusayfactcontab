export class BaseComponent {
    isLoading = false;

    public isResultOk(result) {
        return result?.status === 200;
    }

    public turnOnLoading() {
        this.isLoading = true;
    }

    public turnOffLoading() {
        this.isLoading = false;
    }

}
