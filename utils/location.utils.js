import { getDBRef } from "../db/db.js";
import { PATH_TO } from "../global/iprepapp.global.vars.js";
import Crud from "./crud.utils.js";

export const listenToLocationChanges = (uid, io) =>{
    console.log("called!");
    const crud = new Crud(getDBRef);
    crud.onValue(`${PATH_TO.users}/${uid}`, (error, data)=>{
      if (error){
        return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
      }else{
        const { latitude, longitude} = data;
        console.log(latitude, longitude);

        io.emit('locationUpdate', {latitude, longitude});
      }
    });
  };