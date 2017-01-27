export class Notification {
    public message: any = {
        className: '',
        type: '',
        msg: ''
    };

    public setMessage(type: string = 'error', msg: string, className: string) {
        this.message = {
            className: '',
            type: '',
            msg: ''
        };

        this.message.className = className;
        this.message.type = type;
        this.message.msg = msg;
    }

    public error(msg: string) {
        this.setMessage('error', msg, 'alert-danger');
    }

    public success(msg: string) {
        this.setMessage('success', msg, 'alert-success');
    }

    public info(msg: string) {
        this.setMessage('info', msg, 'alert-info');
    }
}
