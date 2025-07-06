// Initialize students data
let students = JSON.parse(localStorage.getItem('ecologyStudents')) || [];

// DOM elements
const form = document.getElementById('registration-form');
const specializationCards = document.querySelectorAll('.specialization-card');
const confirmationSection = document.getElementById('confirmation');
const confirmedName = document.getElementById('confirmed-name');
const confirmedSpecialization = document.getElementById('confirmed-specialization');
const confirmedDate = document.getElementById('confirmed-date');
const newRegistrationBtn = document.getElementById('new-registration');
const showDataBtn = document.getElementById('show-data');
const exportExcelBtn = document.getElementById('export-excel');
const adminPassword = document.getElementById('admin-password');
const studentsTable = document.querySelector('#students-data tbody');
const noDataMessage = document.getElementById('no-data-message');

// Selected specialization
let selectedSpecialization = null;

// Handle specialization selection
specializationCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove selected class from all cards
        specializationCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        card.classList.add('selected');
        
        // Set selected specialization
        selectedSpecialization = card.getAttribute('data-specialization');
    });
});

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedSpecialization) {
        alert('Veuillez sélectionner une spécialisation avant de soumettre');
        return;
    }
    
    const studentName = document.getElementById('student-name').value;
    
    // Format date in French style
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const frenchDate = now.toLocaleDateString('fr-FR', options);
    
    // Create student object
    const student = {
        id: Date.now(),
        name: studentName,
        specialization: selectedSpecialization,
        date: frenchDate
    };
    
    // Add to students array
    students.push(student);
    
    // Save to localStorage
    localStorage.setItem('ecologyStudents', JSON.stringify(students));
    
    // Show confirmation
    confirmedName.textContent = student.name;
    confirmedSpecialization.textContent = student.specialization;
    confirmedDate.textContent = student.date;
    
    // Hide form and show confirmation
    document.querySelector('.form-section').style.display = 'none';
    confirmationSection.style.display = 'block';
    
    // Reset form
    form.reset();
    specializationCards.forEach(c => c.classList.remove('selected'));
    selectedSpecialization = null;
});

// New registration
newRegistrationBtn.addEventListener('click', () => {
    confirmationSection.style.display = 'none';
    document.querySelector('.form-section').style.display = 'block';
});

// Show data
showDataBtn.addEventListener('click', () => {
    if (adminPassword.value === 'admin123') {
        populateStudentsTable();
        exportExcelBtn.disabled = false;
    } else {
        alert('Mot de passe incorrect');
    }
});

// Populate students table
function populateStudentsTable() {
    studentsTable.innerHTML = '';
    
    if (students.length === 0) {
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.specialization}</td>
            <td>${student.date}</td>
        `;
        
        studentsTable.appendChild(row);
    });
}

// Export to Excel
exportExcelBtn.addEventListener('click', () => {
    // Convert students array to worksheet
    const ws = XLSX.utils.json_to_sheet(students.map(student => ({
        'ID': student.id,
        'Nom de l\'étudiant': student.name,
        'Spécialisation': student.specialization,
        'Date d\'enregistrement': student.date
    })));
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Étudiants');
    
    // Export to Excel
    XLSX.writeFile(wb, 'Etudiants_Master_Ecologie.xlsx');
});

// Initialize admin panel
adminPassword.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        showDataBtn.click();
    }
});