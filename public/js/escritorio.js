//Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams =  new URLSearchParams( window.location.search );
if ( !searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searchParams.get('escritorio');

lblEscritorio.innerText = escritorio
divAlerta.style.display = 'none'

const socket = io();

socket.on('connect', () => {

    btnAtender.disable = false;

});

socket.on('disconnect', () => {

    btnAtender.disable = true;

});

socket.on('tickets-pendientes', (pendientes) => {
    if( pendientes === 0){
        lblPendientes.style.display = 'none';
    }else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes; 
    }
    
})


btnAtender.addEventListener( 'click', () => {

    const payload = { escritorio };
    
    socket.emit('atender-ticket', payload, ( response ) => {

        if (!response.ok){
            lblTicket.innerText = "Nadie";
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${response.ticket.numero}`;
        
    })

});