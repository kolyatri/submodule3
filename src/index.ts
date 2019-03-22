
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";

export const Greeter = async (manager: any) => { 
  let users = await manager.query("select * from freelotto.users limit 1");
  console.log(users);  
};
