// Обработчик формы для страницы join.html
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('join-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                message: formData.get('message'),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: i18next.language || 'ru'
            };
            
            // Логируем данные в консоль (для отладки)
            console.log('Form submission:', data);
            
            // Здесь можно добавить отправку данных на сервер
            // Например, через fetch API или FormData
            
            // Показываем сообщение об успешной отправке
            showSuccessMessage();
            
            // Очищаем форму
            form.reset();
        });
    }
});

// Функция показа сообщения об успешной отправке
function showSuccessMessage() {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    // Текст сообщения в зависимости от языка
    const messages = {
        'en': 'Application sent successfully!',
        'ru': 'Заявка отправлена успешно!',
        'es': '¡Solicitud enviada con éxito!',
        'uk': 'Заявку надіслано успішно!',
        'kk': 'Өтініс сәтті жіберілді!',
        'uz': 'Ariza muvaffaqiyatli yuborildi!',
        'it': 'Candidatura inviata con successo!',
        'de': 'Bewerbung erfolgreich gesendet!',
        'fr': 'Candidature envoyée avec succès!'
    };
    
    const currentLang = i18next.language || 'ru';
    notification.textContent = messages[currentLang] || messages['en'];
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Функция для валидации email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция для валидации формы
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!validateEmail(formData.get('email'))) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.get('role')) {
        errors.push('Please select a role');
    }
    
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Экспортируем функции для возможного использования в других файлах
window.formHandler = {
    validateEmail,
    validateForm,
    showSuccessMessage
}; 