// Charts JavaScript Module for Dashboard
function initializeCharts() {
    setupSkillsChart();
    setupProgressCharts();
    setupActivityChart();
}

// Setup skills radar chart
function setupSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Skills data
    const skills = [
        { name: 'JavaScript', level: 85, color: '#f7df1e' },
        { name: 'React', level: 75, color: '#61dafb' },
        { name: 'Node.js', level: 70, color: '#339933' },
        { name: 'Python', level: 80, color: '#3776ab' },
        { name: 'CSS', level: 90, color: '#1572b6' },
        { name: 'HTML', level: 95, color: '#e34f26' }
    ];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw radar chart
    drawRadarChart(ctx, centerX, centerY, radius, skills);
}

// Draw radar chart
function drawRadarChart(ctx, centerX, centerY, radius, skills) {
    const numSkills = skills.length;
    const angleStep = (2 * Math.PI) / numSkills;
    
    // Draw background circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw axis lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < numSkills; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw skill labels
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        const labelX = centerX + Math.cos(angle) * (radius + 15);
        const labelY = centerY + Math.sin(angle) * (radius + 15);
        ctx.fillText(skills[i].name, labelX, labelY);
    }
    
    // Draw skill levels
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(79, 172, 254, 0.8)';
    ctx.fillStyle = 'rgba(79, 172, 254, 0.2)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < numSkills; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const skillRadius = (radius * skills[i].level) / 100;
        const x = centerX + Math.cos(angle) * skillRadius;
        const y = centerY + Math.sin(angle) * skillRadius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw skill points
    for (let i = 0; i < numSkills; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const skillRadius = (radius * skills[i].level) / 100;
        const x = centerX + Math.cos(angle) * skillRadius;
        const y = centerY + Math.sin(angle) * skillRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = skills[i].color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Setup progress charts (circular progress)
function setupProgressCharts() {
    const progressRings = document.querySelectorAll('.progress-ring-circle');
    
    progressRings.forEach(ring => {
        const percentage = ring.parentElement.parentElement.querySelector('.completion-percentage');
        if (percentage) {
            const value = parseInt(percentage.textContent);
            animateProgressRing(ring, value);
        }
    });
}

// Animate progress ring
function animateProgressRing(ring, percentage) {
    const radius = ring.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
    
    // Animate
    setTimeout(() => {
        ring.style.transition = 'stroke-dashoffset 1s ease-in-out';
        ring.style.strokeDashoffset = offset;
    }, 100);
}

// Setup activity chart (simple line chart)
function setupActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Activity data (last 7 days)
    const activityData = [12, 19, 8, 15, 22, 18, 25];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw activity chart
    drawActivityChart(ctx, width, height, activityData, labels);
}

// Draw activity chart
function drawActivityChart(ctx, width, height, data, labels) {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxValue = Math.max(...data);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight * i) / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + (chartWidth * index) / (data.length - 1);
        const y = padding + chartHeight - (chartHeight * value) / maxValue;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    data.forEach((value, index) => {
        const x = padding + (chartWidth * index) / (data.length - 1);
        const y = padding + chartHeight - (chartHeight * value) / maxValue;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#4facfe';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = 'white';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = padding + (chartWidth * index) / (data.length - 1);
        const y = height - 10;
        ctx.fillText(label, x, y);
    });
}

// Update charts with new data
function updateCharts(newData) {
    if (newData.skills) {
        setupSkillsChart();
    }
    if (newData.progress) {
        setupProgressCharts();
    }
    if (newData.activity) {
        setupActivityChart();
    }
}

// Initialize charts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCharts);
} else {
    initializeCharts();
}
