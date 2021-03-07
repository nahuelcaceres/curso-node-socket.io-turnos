const path = require('path');
const fs = require('fs');

const Ticket = require('./ticket');

class TicketControl{

    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = []; 

        this.init();
    }

    get toJson(){

        return {
            ...this
        }
    }

    init(){
        const { hoy, tickets, ultimo, ultimos4} = require('../db/data.json');

        if ( hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else {
            // Es otro dia
            this.guardarDB();
        }
    }

    guardarDB() {

        const dbPath = path.join(__dirname, '../db/data.json');

        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ));

    };
    

    siguiente() {
        this.ultimo += 1;
        
        const ticket = new Ticket( this.ultimo, null);
        this.tickets.push( ticket );

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    };

    atenderTicket( escritorio ) {

        if ( this.tickets.length === 0 ) {
            return null;
        }

        // const ticket = this.tickets[0];
        // this.tickets.shift();

        // Es lo mismo de arriba pero en un solo paso.
        const ticket = this.tickets.shift();

        ticket.escritorio = escritorio;

        // Agrego el elemento al principio del array
        this.ultimos4.unshift( ticket );

        // Borramos el ultimo del array
        if ( this.ultimos4.length > 4 ) {
            this.ultimos4.slice(-1,1);
        }

        this.guardarDB();

        return ticket;
    };
}

module.exports = TicketControl;