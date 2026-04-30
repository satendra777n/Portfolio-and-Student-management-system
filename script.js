// Student Management System - JavaScript

// Initialize students array from localStorage or use default data
let students = JSON.parse(localStorage.getItem('students')) || [
    {
        id: 1,
        name: "Satendra Negi",
        email: "satendra.negi@student.edu",
        phone: "+91 9876543210",
        course: "Computer Science",
        year: "3rd Year",
        gpa: 3.85
    },
    {
        id: 2,
        name: "Rahul Sharma",
        email: "rahul.sharma@student.edu",
        phone: "+91 9876543211",
        course: "Engineering",
        year: "2nd Year",
        gpa: 3.45
    },
    {
        id: 3,
        name: "Priya Singh",
        email: "priya.singh@student.edu",
        phone: "+91 9876543212",
        course: "Business Administration",
        year: "4th Year",
        gpa: 3.90
    },
    {
        id: 4,
        name: "Amit Kumar",
        email: "amit.kumar@student.edu",
        phone: "+91 9876543213",
        course: "Computer Science",
        year: "1st Year",
        gpa: 3.20
    },
    {
        id: 5,
        name: "Anjali Gupta",
        email: "anjali.gupta@student.edu",
        phone: "+91 9876543214",
        course: "Science",
        year: "2nd Year",
        gpa: 3.75
    }
];

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchInput');
const noDataMessage = document.getElementById('noDataMessage');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeBtn = document.querySelector('.close');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderStudents();
    updateStats();
});

// Form submission handler
studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newStudent = {
        id: generateId(),
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        course: document.getElementById('studentCourse').value,
        year: document.getElementById('studentYear').value,
        gpa: parseFloat(document.getElementById('studentGPA').value)
    };
    
    students.push(newStudent);
    saveStudents();
    renderStudents();
    updateStats();
    studentForm.reset();
    
    // Show success message
    showNotification('Student added successfully!', 'success');
});

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    renderStudents(searchTerm);
});

// Edit button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-edit')) {
        const studentId = parseInt(e.target.closest('.btn-edit').dataset.id);
        openEditModal(studentId);
    }
    
    if (e.target.closest('.btn-delete')) {
        const studentId = parseInt(e.target.closest('.btn-delete').dataset.id);
        deleteStudent(studentId);
    }
});

// Close modal
closeBtn.addEventListener('click', function() {
    editModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Edit form submission
editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentId = parseInt(document.getElementById('editStudentId').value);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        students[studentIndex] = {
            id: studentId,
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            course: document.getElementById('editCourse').value,
            year: document.getElementById('editYear').value,
            gpa: parseFloat(document.getElementById('editGPA').value)
        };
        
        saveStudents();
        renderStudents();
        updateStats();
        editModal.style.display = 'none';
        
        showNotification('Student updated successfully!', 'success');
    }
});

// Function to render students
function renderStudents(searchTerm = '') {
    studentTableBody.innerHTML = '';
    
    const filteredStudents = students.filter(student => {
        if (!searchTerm) return true;
        return (
            student.name.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.course.toLowerCase().includes(searchTerm)
        );
    });
    
    if (filteredStudents.length === 0) {
        noDataMessage.style.display = 'block';
    } else {
        noDataMessage.style.display = 'none';
        
        filteredStudents.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td><strong>${student.name}</strong></td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.course}</td>
                <td>${student.year}</td>
                <td>${getGPABadge(student.gpa)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${student.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" data-id="${student.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }
}

// Function to get GPA badge
function getGPABadge(gpa) {
    let badgeClass = 'gpa-medium';
    if (gpa >= 3.5) badgeClass = 'gpa-high';
    else if (gpa < 2.5) badgeClass = 'gpa-low';
    
    return `<span class="gpa-badge ${badgeClass}">${gpa.toFixed(2)}</span>`;
}

// Function to update statistics
function updateStats() {
    document.getElementById('totalStudents').textContent = students.length;
    
    const topPerformers = students.filter(s => s.gpa >= 3.5).length;
    document.getElementById('topPerformers').textContent = topPerformers;
    
    const avgGPA = students.length > 0 
        ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
        : '0.00';
    document.getElementById('avgGPA').textContent = avgGPA;
}

// Function to open edit modal
function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        document.getElementById('editStudentId').value = student.id;
        document.getElementById('editName').value = student.name;
        document.getElementById('editEmail').value = student.email;
        document.getElementById('editPhone').value = student.phone;
        document.getElementById('editCourse').value = student.course;
        document.getElementById('editYear').value = student.year;
        document.getElementById('editGPA').value = student.gpa;
        
        editModal.style.display = 'block';
    }
}

// Function to delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== studentId);
        saveStudents();
        renderStudents();
        updateStats();
        showNotification('Student deleted successfully!', 'success');
    }
}

// Function to generate unique ID
function generateId() {
    return Math.max(...students.map(s => s.id), 0) + 1;
}

// Function to save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Function to show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);