document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const dayDisplay = document.getElementById('day-display');
    const calendarGrid = document.getElementById('calendar-grid');
    const monthSelect = document.getElementById('month-select');
    const monthlyProgressBar = document.getElementById('monthly-progress-bar');
    const monthlyProgressPercentage = document.getElementById('monthly-progress-percentage');
    const monthlyFeedbackDiv = document.getElementById('monthly-feedback');

    const tasks = [
        { time: "3:30AM-4:00AM", activity: "wake up , get fresh and drink hot lemon water" },
        { time: "4:00AM-4:30AM", activity: "Get body fit" },
        { time: "4:30AM-5:30AM", activity: "Practice for gate previous year questions for 1 hour" },
        { time: "5:30AM-6:30AM", activity: "Get ready for the college" },
        { time: "8:00AM-4:00PM", activity: "Attend the college" },
        { time: "5:30PM-6:00PM", activity: "Get fresh" },
        { time: "6:00PM-6:30PM", activity: "Get the body fit" },
        { time: "6:30PM-8:00PM", activity: "Do the project work" },
        { time: "8:15PM-9:15PM", activity: "Do 1 sub for gate preparation" },
        { time: "9:30PM-10:30PM", activity: "Do 2nd sub for gate preparation" },
    ];

    let currentDate = new Date();
    let selectedDay = currentDate.getDate();

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
            const completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
            const completedCount = Object.values(completedTasks).filter(Boolean).length;

            if (completedCount === tasks.length && tasks.length > 0) {
                dayDiv.classList.add('completed');
            }

            if (day === selectedDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayDiv.classList.add('active');
            }

            dayDiv.addEventListener('click', () => {
                const allDays = document.querySelectorAll('.calendar-day');
                allDays.forEach(d => d.classList.remove('active'));
                dayDiv.classList.add('active');
                selectedDay = day;
                renderTasks(month, year, selectedDay);
            });

            calendarGrid.appendChild(dayDiv);
        }
    };

    const renderTasks = (month, year, day) => {
        taskList.innerHTML = '';
        dayDisplay.textContent = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const storageKey = `goals_${year}_${month}_${day}`;
        const completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const isCompleted = completedTasks[index];
            
            li.innerHTML = `
                <span class="task-time">${task.time}</span>
                <span class="task-activity">${task.activity}</span>
                <input type="checkbox" data-index="${index}" ${isCompleted ? 'checked' : ''}>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                completedTasks[index] = e.target.checked;
                localStorage.setItem(storageKey, JSON.stringify(completedTasks));
                updateMonthlySummary();
                renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
            });

            taskList.appendChild(li);
        });
    };

    const updateMonthlySummary = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        let totalCompleted = 0;
        let totalPossible = daysInMonth * tasks.length;

        for (let day = 1; day <= daysInMonth; day++) {
            const storageKey = `goals_${year}_${month}_${day}`;
            const completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
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

    monthSelect.addEventListener('change', (e) => {
        const selectedMonth = parseInt(e.target.value);
        currentDate.setMonth(selectedMonth);
        selectedDay = 1;
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
        renderTasks(currentDate.getMonth(), currentDate.getFullYear(), selectedDay);
        updateMonthlySummary();
    });

    const init = () => {
        populateMonthDropdown();
        renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
        renderTasks(currentDate.getMonth(), currentDate.getFullYear(), selectedDay);
        updateMonthlySummary();
    };

    init();
});