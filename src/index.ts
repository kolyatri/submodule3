
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";

//export const Greeter = (name: string) => `Hello ${name}`;
export const Greeter = async (manager: any) => {
    //createConnection().then(async connection => { 
    //    console.log("successfully connected");
        let users = await manager.query("select * from freelotto.users limit 1");
        console.log(users);
  //  }).catch(error => console.log(error));      
};
