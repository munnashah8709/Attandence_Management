document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('attendance-date').value;

    console.log(date)
    
    // Fetch attendance data for the given date
    fetch(`/attendance/search?date=${date}`)
        .then(response => response.json())
        .then(data => {

            const reportContainer = document.getElementById('report-container');
            reportContainer.innerHTML = '';
            const attendanceForm = document.getElementById('attendance-form');
            attendanceForm.innerHTML = ''; // Clear any existing content
 

            data.students.forEach(student=>{
                console.log(student.status)
                if(student.status != null){
                        const studentDiv = document.createElement('div');
                        studentDiv.classList.add('student-item');
                        studentDiv.innerHTML = `${student.name}: <span class="">${student.status}</span>`;
                        attendanceForm.appendChild(studentDiv);
                 
                }else{
                    fetchStudentsForAttendance(date);
                }
            })
        })
        .catch(err => {
            console.error('Error fetching data:', err);
        });
});
function fetchStudentsForAttendance(date) {
    // Fetch the list of students to mark attendance for
    console.log("Fetching students for attendance...");

    fetch('/students')
        .then(response => response.json())
        .then(data => {
            const reportContainer = document.getElementById('report-container');
            reportContainer.innerHTML = ''; // Clear previous report
            const attendanceForm = document.getElementById('attendance-form');
            attendanceForm.innerHTML = ''; // Clear any previous content

            // Check if students are fetched successfully
            if (data.students && data.students.length > 0) {
                data.students.forEach(student => {
                    const studentDiv = document.createElement('div');
                    studentDiv.classList.add('student-item');
                    
                    studentDiv.innerHTML = `
                        <label for="attendance-${student.id}">${student.name}:</label>
                        <input type="radio" name="attendance-${student.id}" value="present" id="present-${student.id}" /> Present
                        <input type="radio" name="attendance-${student.id}" value="absent" id="absent-${student.id}" /> Absent
                    `;
                    
                    attendanceForm.appendChild(studentDiv);
                });

                // Submit attendance button
                const submitButton = document.createElement('button');
                submitButton.innerHTML = 'Submit Attendance';
                submitButton.addEventListener('click', function() {
                    submitAttendance(date);
                });
                attendanceForm.appendChild(submitButton);
            } else {
                console.log("No students found.");
            }
        })
        .catch(err => {
            console.error('Error fetching students:', err);
        });
}
function submitAttendance(date) {
    const attendanceData = [];
    const students = document.querySelectorAll('[name^="attendance-"]');

    students.forEach(radio => {
        if (radio.checked) {
            const studentId = radio.name.split('-')[1];
            const status = radio.value;
            attendanceData.push({ studentId, status });
        }
    });

    // Post attendance data to the server
    fetch('/attendance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, attendanceData })
    })
    .then(response => response.json())
    .then(data => {
        alert('Attendance marked successfully!');

        fetch(`/attendance/search?date=${date}`)
        .then(response => response.json())
        .then(data => {
            const attendanceForm = document.getElementById('attendance-form');
            attendanceForm.innerHTML = ''; // Clear any existing content
 

            data.students.forEach(student=>{
                console.log(student.status)
                if(student.status != null){
                        const studentDiv = document.createElement('div');
                        studentDiv.classList.add('student-item');
                        studentDiv.innerHTML = `${student.name}: <span class="">${student.status}</span>`;
                        attendanceForm.appendChild(studentDiv);
                 
                }
            })
        })
        .catch(err => {
            console.error('Error fetching data:', err);
        });

        
    })
    .catch(err => {
        console.error('Error submitting attendance:', err);
    });
}


document.getElementById('fetch-report').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default behavior (if inside a form)
    
    fetchAttendanceReport()
   
});


function fetchAttendanceReport() {
    fetch('/attendance/report')
        .then(response => response.json())
        .then(data => {

            const attendanceForm = document.getElementById('attendance-form');
            attendanceForm.innerHTML = ''; 
            const reportContainer = document.getElementById('report-container');
            reportContainer.innerHTML = ''; // Clear previous report

            if (data.attendance_report.length === 0) {
                reportContainer.innerHTML = '<p>No attendance records found.</p>';
                return;
            }

            // Create a table for the report
            const table = document.createElement('table');
            table.border = '1';

            // Create table header
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Student Name</th>
                <th>Total Classes</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance (%)</th>
            `;
            table.appendChild(headerRow);

            // Populate table rows with data
            data.attendance_report.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.total_classes}</td>
                    <td>${student.present_count}</td>
                    <td>${student.absent_count}</td>
                    <td>${(Number(student.attendance_percentage) || 0).toFixed(2)}%</td>
                `;
                table.appendChild(row);
            });

            reportContainer.appendChild(table);
        })
        .catch(err => {
            console.error('Error fetching attendance report:', err);
        });
}




