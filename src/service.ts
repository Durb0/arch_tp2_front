import { socket } from "./socket";
import { status_chaudiere, temp, plages_horaire, tr, error_chaudiere } from "./store";

export class Service {
    

    constructor() {
        socket.on('connected', () => {
            console.log('Connected to server')
        });


        socket.on('status_chaudiere', (data) => {
            console.log('status_chaudiere',data)
            status_chaudiere.set(data)
        });

        socket.on('Tm', (data) => {
            console.log('temp',data)
            temp.set(data)
        });

        socket.on('plages_horaire', (data) => {
            console.log('plages_horaire',data)
            plages_horaire.set(data)
        });

        socket.on('Tr', (data) => {
            console.log('Tr',data)
            tr.set(data)
        });

        socket.on('error_chaudiere', (data) => {
            console.log('error_chaudiere',data)
            error_chaudiere.set(data)
        });
    }

    addPlageHoraire(debut: number, fin: number){
        socket.emit('add_plage_horaire', {debut, fin});

        socket.on('id_plage_horaire', (id) => {
            let plage = {id, debut, fin}
        //update store
            plages_horaire.update((plages_horaire) => {
                return [...plages_horaire, plage]
            });
        });
    }

    deletePlageHoraire(id: any) {
        socket.emit('delete_plage_horaire', id);
        socket.on('delete_plage_status', (status) => {
            if(status){
                plages_horaire.update((plages_horaire) => {
                    return plages_horaire.filter(plage => plage.id !== id)
                });
            }
            else{
                console.log('error delete plage horaire')
            }
        });
    }

    updateTempRef(temp_ref: number) {
        socket.emit('change_tr', temp_ref);
    }


    requestStatusChaudiere(){
        socket.emit('status_chaudiere')
    }

    requestTemp(){
        socket.emit('Tm')
    }

    requestTempRef(){
        socket.emit('Tr')
    }

    requestPlagesHoraire(){
        socket.emit('plages_horaire')
    }

    requestErrorChaudiere(){
        socket.emit('error_chaudiere')
    }
      
    ping(){
        socket.emit('ping', 'Hello from SvelteKit')
    }
}



