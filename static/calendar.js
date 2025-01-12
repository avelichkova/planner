const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('leftBtn');
const nextBtn = document.getElementById('righttBtn');
const currMonthBth = document.getElementById('currMonthBtn');

let currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const updateCal = function() {
    const currYear = currentDate.getFullYear();
    const currMonth = currentDate.getMonth();
    const lastDate = new Date(currYear, currMonth + 1, 0);

    const totalDays = lastDate.getDate();

    // let dates = "";
    datesElement.innerHTML = '';

    //getting the indexes of the day before, so the calendar can start with monday, not sunday
    const firstDayIndex = new Date(currYear, currMonth, 0).getDay();
    const lastDayIndex = new Date(currYear, currMonth + 1, -1).getDay();

    const monthName = currentDate.toLocaleString('default', {month: 'short'});
    // const yearName = currentDate.toLocaleString('default', {year: 'n'});

    for(let i = firstDayIndex ; i > 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0 - i + 1); // getting the days from the prev month
        // const daySquare = document.createElement('div');
        // daySquare.classList.add('day');
        // dates += `<div class = "date inactiveDays">
        //         <label for="rate-1">
        //         <input type="radio" id="rate-1" name="rate" value="${date.getDate()}-${monthName}-${currYear}" />
        //         <span>${date.getDate()}</span>
        //         </label>
        //     </div>`;
        const daySquare = document.createElement('div');
        // daySquare.classList.add('date').add('inactiveDays');
        daySquare.classList.add('date');
        daySquare.classList.add('inactiveDays');
        daySquare.innerText = date.getDate();
        datesElement.appendChild(daySquare);
    }

    for(let i = 1; i <= totalDays; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i); // getting the days from the current month
        const className = date.toDateString() === new Date().toDateString() ? 
            `id = "currDay" class = "date" ` 
            : `class = "date currDays"`;
        // dates += date.toDateString() === new Date().toDateString() ? 
        // `<div ${className}>
        //         <label for="rate-1">
        //         <input type="radio" id="rate-1" name="rate" value="${date.getDate()}-${monthName}-${currYear} checked="checked"" />
        //         <span>${date.getDate()}</span>
        //         </label>
        //     </div>`:
        // `<div ${className}>
        //         <label for="rate-1">
        //         <input type="radio" id="rate-1" name="rate" value="${date.getDate()}-${monthName}-${currYear}" />
        //         <span>${date.getDate()}</span>
        //         </label>
        //     </div>`;

        const daySquare = document.createElement('div');
        // daySquare.classList.add('date').add('inactiveDays');
        daySquare.classList.add('date');
        daySquare.classList.add('currDays');
        daySquare.innerText = date.getDate();
        datesElement.appendChild(daySquare);
    }

    for(let i = lastDayIndex; i < 6; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i - lastDayIndex + 1); // getting days from next month
        // dates += `<div class = "date inactiveDays">
        //         <label for="rate-1">
        //         <input type="radio" id="rate-1" name="rate" value="${date.getDate()}-${monthName}-${currYear}" />
        //         <span>${date.getDate()}</span>
        //         </label>
        //     </div>`;
        const daySquare = document.createElement('div');
        // daySquare.classList.add('date').add('inactiveDays');
        daySquare.classList.add('date');
        daySquare.classList.add('inactiveDays');
        daySquare.innerText = date.getDate();
        datesElement.appendChild(daySquare);
    }
  
    // datesElement.innerHTML += dates;

    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year : 'numeric'})
    monthYearElement.textContent = monthYearString;
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCal();
})

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCal();
})

currMonthBth.addEventListener('click', () => {
    currentDate.setMonth(currentMonth);
    currentDate.setFullYear(currentYear);
    updateCal();
})

updateCal();


