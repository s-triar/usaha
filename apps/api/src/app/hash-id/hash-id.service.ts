import { Injectable, Scope } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Hashids = require('hashids/cjs')
import { environment } from '../../environments/environment';
@Injectable({scope:Scope.DEFAULT})
export class HashIdService {
    private hasher = new Hashids(environment.hasherIdSalt);

    constructor(){}

    encrypt(val:number):string{
        return this.hasher.encode(val);
    }
    decrypt(decryptedVal:string):number{
        return this.hasher.decode(decryptedVal)[0]
    }


}
