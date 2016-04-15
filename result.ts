export class Response {
    return_:boolean;
    time:number;
    result:any;
    msg:string;

    public constructor(ret, time, result, msg) {
        this.return_ = ret;
        this.time = time;
        this.result = result;
        this.msg = msg;
    }

    public getResponse():Response {
        return this;
    }
}