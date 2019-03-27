
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";

/*export const Greeter = async (manager: any) => { 
  let users = await manager.query("select * from freelotto.users limit 1");
  console.log(users);  
};*/

export class freelottoAuth {
  //private currentToken:any;
  private myCache:any;

  contructor(cache:any ){
    //this.currentToken = token;
    this.myCache =  cache;
  }

  public verifyUserToken(token:string){
    let user =  this.myCache.get(token);
    if ( user == undefined ){
      console.log("undefined");
    }
    else{
      console.log(user);
    }

  }
}

