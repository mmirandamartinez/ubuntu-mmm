document.addEventListener("DOMContentLoaded", function() {
    const monthYearElem = document.querySelector('.calendar-header .month-year');
    const calendarBody = document.getElementById('calendar-body');
    const prevBtn = document.querySelector('.calendar-header .prev');
    const nextBtn = document.querySelector('.calendar-header .next');
    const timeElem = document.querySelector('.time');
    const calendar = document.querySelector('.calendar');
    let currentDate = new Date();

    // Helper para formato de hora según config
    function getHourFormatSetting() {
        const settingsRaw = localStorage.getItem('ubuntuSettings');
        if (settingsRaw) {
            try {
                const { hourFormat } = JSON.parse(settingsRaw);
                return hourFormat === "12" ? "12" : "24";
            } catch {}
        }
        return "24"; // default
    }

//Función principal para renderizar el calendario
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth(); 
        monthYearElem.textContent = date.toLocaleString('default', { month: 'long' }) + " " + year;
        calendarBody.innerHTML = "";

//Calcula el dia del mes y cuantos dias tiene el mes
        let firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let row = document.createElement('tr');
        for(let i = 0; i < firstDay; i++){
            let cell = document.createElement('td');
            row.appendChild(cell);
        }
//crea las celdas
        for(let day = 1; day <= daysInMonth; day++){
            if((firstDay + day - 1) % 7 === 0 && day !== 1){
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }
            let cell = document.createElement('td');
            cell.textContent = day;

//marca el dia que es
            const today = new Date();
            if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
                cell.classList.add('current-day');
            }
            row.appendChild(cell);
        }
        while(row.children.length < 7){
            let cell = document.createElement('td');
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    renderCalendar(currentDate);

//deja que puedas moverte por los meses
    prevBtn.addEventListener('click', function(){
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        renderCalendar(currentDate);
    });
    nextBtn.addEventListener('click', function(){
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        renderCalendar(currentDate);
    });

//Hace que el calendario se cierre al hacer click fuera de el
    timeElem.addEventListener('click', function(event) {
        event.stopPropagation();
        calendar.classList.toggle('active');
    });
    document.addEventListener('click', function(e) {
        if (!calendar.contains(e.target) && !timeElem.contains(e.target)) {
            calendar.classList.remove('active');
        }
    });

//actualiza la hora
    function updateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, '0');

        const format = getHourFormatSetting();

        let hourDisplay;
        if(format === "12") {
            let ampm = hours >= 12 ? "PM" : "AM";
            hourDisplay = ((hours % 12) || 12) + ":" + minutes + " " + ampm;
        } else {
            hourDisplay = String(hours).padStart(2, '0') + ":" + minutes;
        }
        timeElem.textContent = `${day} ${month}, ${hourDisplay}`;
    }
    updateTime();
    let intervalId = setInterval(updateTime, 60000);

    // Actualizar formato de hora en tiempo real si cambia en settings
    window.addEventListener("storage", function(e){
        if(e.key === "ubuntuSettings") {
            updateTime();
        }
    });
    // Además, por si cambia en la misma ventana, observar el selector
    const hourFormatSel = document.getElementById("hour-format");
    if(hourFormatSel){
        hourFormatSel.addEventListener("change", function(){
            setTimeout(updateTime, 100);
        });
    }
});
