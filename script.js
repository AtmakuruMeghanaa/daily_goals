document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const dayDisplay = document.getElementById('day-display');
    const calendarGrid = document.getElementById('calendar-grid');
    const monthSelect = document.getElementById('month-select');
    const monthlyProgressBar = document.getElementById('monthly-progress-bar');
    const monthlyProgressPercentage = document.getElementById('monthly-progress-percentage');
    const monthlyFeedbackDiv = document.getElementById('monthly-feedback');
    const taskContainer = document.getElementById('task-container');
    const dayTypeSelection = document.getElementById('day-type-selection');
    const workingDayBtn = document.getElementById('working-day-btn');
    const holidayBtn = document.getElementById('holiday-btn');
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');
    const saveBtn = document.getElementById('save-btn');

    const workingDayTasks = [
        { time: "3:30AM-4:00AM", activity: "wake up , get fresh and drink hot lemon water" },
        { time: "4:00AM-4:30AM", activity: "Get body fit" },
        { time: "4:30AM-5:30AM", activity: "Practice for gate previous year questions for 1 hour" },
        { time: "5:30AM-6:30AM", activity: "Get ready for the college" },
        { time: "8:00AM-4:00PM", activity: "Attend the college" },
        { time: "5:30PM-6:00PM", activity: "Get fresh" },
        { time: "6:00PM-6:30PM", activity: "Get the body fit" },
        { time: "6:30PM-8:00PM", activity: "Do the project work" },
        { time: "8:15PM-9:15PM", activity: "Do 1 sub for gate preparation" },
        { time: "9:30PM-10:30PM", activity: "Do 2nd sub for gate preparation" }
    ];

    const holidayTasks = [
        { time: "6:00AM-6:30AM", activity: "Wake up and fresh up" },
        { time: "6:30AM-7:30AM", activity: "Exercise for whole body" },
        { time: "7:30AM-8:30AM", activity: "Get hair done and fresh up" },
        { time: "8:30AM-9:00AM", activity: "Have breakfast" },
        { time: "9:00AM-9:30AM", activity: "Take rest" },
        { time: "9:30AM-11:00AM", activity: "Do 1 subject for gate preparation" },
        { time: "11:00AM-12:00PM", activity: "Project work" },
        { time: "12:00PM-1:00PM", activity: "Have lunch and relax" },
        { time: "1:00PM-2:30PM", activity: "Do project work" },
        { time: "2:30PM-4:00PM", activity: "Do 2nd subject for gate preparation" },
        { time: "4:00PM-5:00PM", activity: "Evening walk and fresh up" },
        { time: "5:00PM-6:30PM", activity: "Revise the whole week gate preparation for a subject(1)" },
        { time: "6:30PM-7:00PM", activity: "Have dinner" },
        { time: "7:00PM-8:30PM", activity: "Revise the whole week gate preparation for a subject(2)" },
        { time: "8:30PM-9:00PM", activity: "Have fun" },
    ];

    let currentDate = new Date();
    let selectedDay = currentDate.getDate();
    let currentTasks = [];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const populateMonthDropdown = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthSelect.innerHTML = '';
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${monthNames[i]} ${currentYear}`;
            if (i === currentMonth) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        }
    };

    const renderCalendar = (month, year) => {
        calendarGrid.innerHTML = '';
        const daysInMonth = getDaysInMonth(month, year);
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            calendarGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.textContent = day;
            dayDiv.dataset.day = day;

            const storageKey = `goals_${year}_${month}_${day}`;
            const dayType = localStorage.getItem(`${storageKey}_type`);
            const completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
            const completedCount = Object.values(completedTasks).filter(Boolean).length;
            const tasksToUse = dayType === 'working' ? workingDayTasks : holidayTasks;

            if (dayType && tasksToUse.length > 0 && completedCount === tasksToUse.length) {
                dayDiv.classList.add('completed');
            }

            if (day === selectedDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayDiv.classList.add('active');
            }

            dayDiv.addEventListener('click', () => {
                selectedDay = day;
                loadDayContent(month, year, day);
            });

            calendarGrid.appendChild(dayDiv);
        }
    };

    const loadDayContent = (month, year, day) => {
        const savedDayType = localStorage.getItem(`goals_${year}_${month}_${day}_type`);

        dayDisplay.textContent = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const allDays = document.querySelectorAll('.calendar-day');
        allDays.forEach(d => d.classList.remove('active'));
        const clickedDay = document.querySelector(`.calendar-day[data-day="${day}"]`);
        if (clickedDay) {
            clickedDay.classList.add('active');
        }

        if (savedDayType) {
            currentTasks = savedDayType === 'working' ? workingDayTasks : holidayTasks;
            renderTasks(month, year, day);
            taskContainer.classList.remove('hidden');
            dayTypeSelection.classList.add('hidden');
            calendarGrid.classList.add('hidden');
        } else {
            calendarGrid.classList.add('hidden');
            dayTypeSelection.classList.remove('hidden');
            taskContainer.classList.add('hidden');
        }
    };

    const renderTasks = (month, year, day) => {
        taskList.innerHTML = '';
        const storageKey = `goals_${year}_${month}_${day}`;
        const completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};

        currentTasks.forEach((task, index) => {
            const li = document.createElement('li');
            const isCompleted = completedTasks[index];
            
            li.innerHTML = `
                <span class="task-time">${task.time}</span>
                <span class="task-activity">${task.activity}</span>
                <input type="checkbox" data-index="${index}" ${isCompleted ? 'checked' : ''}>
            `;
            taskList.appendChild(li);
        });
    };

    const updateMonthlySummary = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        let totalCompleted = 0;
        let totalPossible = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const storageKey = `goals_${year}_${month}_${day}`;
            const completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
            const dayType = localStorage.getItem(`${storageKey}_type`);

            if (dayType === 'working') {
                totalPossible += workingDayTasks.length;
            } else if (dayType === 'holiday') {
                totalPossible += holidayTasks.length;
            }

            totalCompleted += Object.values(completedTasks).filter(Boolean).length;
        }

        const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
        
        monthlyProgressBar.style.width = `${percentage}%`;
        monthlyProgressPercentage.textContent = `${percentage.toFixed(0)}% completed`;

        if (percentage >= 90) {
            monthlyFeedbackDiv.textContent = "Outstanding work this month! You've shown incredible dedication. 🔥";
        } else if (percentage >= 70) {
            monthlyFeedbackDiv.textContent = "You're building great habits! Keep the learning momentum going. 🚀";
        } else if (percentage >= 50) {
            monthlyFeedbackDiv.textContent = "You're halfway there! Every small step adds up. 💪";
        } else {
            monthlyFeedbackDiv.textContent = "Let's focus on consistency. A little progress each day makes a big difference. 🌱";
        }
    };
    
    // Event listener for Working Day button
    workingDayBtn.addEventListener('click', () => {
        const storageKey = `goals_${currentDate.getFullYear()}_${currentDate.getMonth()}_${selectedDay}`;
        localStorage.setItem(`${storageKey}_type`, 'working');
        currentTasks = workingDayTasks;
        dayTypeSelection.classList.add('hidden');
        renderTasks(currentDate.getMonth(), currentDate.getFullYear(), selectedDay);
        taskContainer.classList.remove('hidden');
        updateMonthlySummary();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Event listener for Holiday button
    holidayBtn.addEventListener('click', () => {
        const storageKey = `goals_${currentDate.getFullYear()}_${currentDate.getMonth()}_${selectedDay}`;
        localStorage.setItem(`${storageKey}_type`, 'holiday');
        currentTasks = holidayTasks;
        dayTypeSelection.classList.add('hidden');
        renderTasks(currentDate.getMonth(), currentDate.getFullYear(), selectedDay);
        taskContainer.classList.remove('hidden');
        updateMonthlySummary();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Event listener for Next Day button
    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        selectedDay = currentDate.getDate();
        loadDayContent(currentDate.getMonth(), currentDate.getFullYear(), selectedDay);
        updateMonthlySummary();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Event listener for Previous Day button
    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        selectedDay = currentDate.getDate();
        loadDayContent(currentDate.getMonth(), currentDate.getFullYear(), selectedDay);
        updateMonthlySummary();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Event listener for Save button
    saveBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#task-list input[type="checkbox"]');
        const storageKey = `goals_${currentDate.getFullYear()}_${currentDate.getMonth()}_${selectedDay}`;
        const completedTasks = {};
        checkboxes.forEach((checkbox, index) => {
            completedTasks[index] = checkbox.checked;
        });
        localStorage.setItem(storageKey, JSON.stringify(completedTasks));
        updateMonthlySummary();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
        alert('Progress saved!');
    });

    // Event listener for month selection dropdown
    monthSelect.addEventListener('change', (e) => {
        const selectedMonth = parseInt(e.target.value);
        currentDate.setMonth(selectedMonth);
        selectedDay = undefined;
        taskContainer.classList.add('hidden');
        dayTypeSelection.classList.add('hidden');
        calendarGrid.classList.remove('hidden');
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
        updateMonthlySummary();
    });

    const init = () => {
        populateMonthDropdown();
        updateMonthlySummary();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
    };

    init();
});