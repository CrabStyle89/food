
document.addEventListener("DOMContentLoaded", () => {

    ///табы
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsParrent = document.querySelector('.tabheader__items'),
        tabСontent = document.querySelectorAll('.tabcontent');

    function hideContent() {
        tabСontent.forEach(item => {
            item.classList.remove('show');
            item.classList.add('hide', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showContent(i = 0) {
        tabСontent[i].classList.add('show');
        tabСontent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
        
    }
    hideContent();
    showContent();
    
    tabsParrent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideContent();
                    showContent(i);
                }
            });
        }


    });

///таймер

    const deadLine='2021-12-31';

    function getTimeRemaining(time){
        const t = Date.parse(deadLine) - Date.parse(new Date()), /// преобразование даты(в милисикундах) в обычное время
        days = Math.floor(t/(1000*60*60*24)),
        hours = Math.floor((t/(1000*60*60)%24)),
        minutes = Math.floor((t/(1000*60))%60),
        seconds =Math.floor((t/1000)%60);
        
        return {            /// возврат обьекта с данными по времени
            'total':t,
            'days':days,
            'hours':hours,
            'minutes':minutes,
            'seconds':seconds
        };

    }
    
    function getZero(num){///проверка на кол-во знаков 
        if(num<10 && num>=0){
            return `0${num}`;
        }
        else{
            return num;
        }
    }

    function setClock(selector, endTime){ /// выбираем сектор с таймером, и передаем коненое время для функции внутри
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timerInterval = setInterval(updateClock,1000);
        
        
        function updateClock(){
            const t = getTimeRemaining(endTime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            if (t.total<=0){
                clearInterval(setInterval);
                
            }
            
        }
        

    }
    setClock('.timer', deadLine);   

    ///modal

    const btnModal = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

    btnModal.forEach(item =>{
        item.addEventListener('click',()=>{
            modalShow();
        });
    });
    
    modal.addEventListener('click',(e)=>{
        if( e.target=== modal || e.target.getAttribute('data-close')==''){
            modalClose();
            
        }
        
    });
   
    function modalShow(){
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearTimeout(modalTimer);
    }

    function modalClose(){
        
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    document.addEventListener('keydown', (e)=>{
        if (e.code == "Escape"){
            modalClose();
        }
    });
    const modalTimer = setTimeout(modalShow,5000);

    function modalScrollShow (){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            modalShow();
            window.removeEventListener('scroll', modalScrollShow);
        }
    }
    window.addEventListener('scroll',modalScrollShow);

    /// шаблонизируем меню

    class MenuClass {
        constructor(src, alt, title, content, price, parentSelector,... classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.content = content;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer  = 27;
            this.changeToUah();
            
            
        }
        changeToUah (){
            this.price = this.price * this.transfer;
        }
        render () {
            let element = document.createElement("div");
            if(this.classes.length === 0){
                element.classList.add("menu__item");
            }
            else {
                this.classes.forEach(classItem => element.classList.add(classItem));
            }
            
            
            element.innerHTML = `
            
            <img src=${this.src} alt="vegy">
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.content}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        </div>
            `;
            
            this.parent.append(element);
            
        }
    }
    new MenuClass(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();

    new MenuClass(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        5,
        '.menu .container'
    ).render();

    new MenuClass(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        13,
        '.menu .container'
    ).render();

    // post form

    const forms = document.querySelectorAll('form');
    const message = {
        loading : 'img/form/spinner.svg',
        succes : 'all done',
        failure : 'something wrong'
    };
    forms.forEach(item=> {
        postForm(item);
    });
    
    function postForm(form) {
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText= `
            display: block;
            margin: 0 auto;`;

            statusMessage.textContent = message.loading;
            form.insertAdjacentElement('afterend', statusMessage);
           
            const formData = new FormData(form);
            const object = {};
            formData.forEach(function(value, key){
                object[key]=value;
            });
            const json = JSON.stringify(object);


            
            
            fetch('server.php', {
                method: "POST",
                headers: {
                    'Content-type':'application/json'
                },
                body: JSON.stringify(object)
            })
            .then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.succes);
                
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);   
            }).finally(()=>{
                form.reset();
            });
        
            
        });

    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        modalShow();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            modalClose();

        },4000); 

    }
    fetch('db.json')
    .then(data=>data.json())
    .then(res => console.log(res));
});
