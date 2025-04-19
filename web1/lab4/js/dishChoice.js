let formEmpty = true;

const formgroupDishchoice = document.querySelectorAll('.form-group.dish-choice');
const dishChoiceValueElements = document.querySelectorAll(`.form-group.dish-choice > input`);
const dishChoiceNameElements = document.querySelectorAll(`.form-group.dish-choice > p.dish-choice`);
const orderAmountNameElement = document.querySelector(`.form-group > p.label.dish-choice`);
const orderAmountElement = document.querySelector(".form-group>.order-amount");

const orderSumCalc = () => {
    let orderSum = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < dish.length; j++) {
            if (dishChoiceValueElements[i].value == dish[j].keyword && dishChoiceValueElements[i] != "") {
                orderSum += dish[j].price;
            }
            continue;
        }
    }
    orderAmountElement.textContent = `${orderSum}₽`;
};

const onFormReset = () =>{
    formEmpty = true;
    formgroupDishchoice.forEach((element) => {
        element.style.display = 'none';
    });
    dishChoiceNameElements[0].textContent = "Суп не выбран";
    dishChoiceNameElements[1].textContent = "Главное блюдо не выбрано";
    dishChoiceNameElements[2].textContent = "Напиток не выбран";
    dishChoiceValueElements.forEach((element) => {
        element.value = '';
    });
    orderAmountNameElement.textContent = "Ничего не выбрано";
    orderSumCalc();
    orderAmountElement.style.display = "none";
};


const updateFormData = (data) => {
    orderAmountNameElement.textContent = "Стоимость заказа";
    for (let i = 0; i < dish.length; i++) {
        if (dish[i].keyword == data.dish) {
            switch (dish[i].category) {
            case 'soup':
                dishChoiceNameElements[0].textContent = `${dish[i].name} ${dish[i].price}₽`;
                dishChoiceValueElements[0].value = dish[i].keyword;
                break;
            case 'main_course':
                dishChoiceNameElements[1].textContent = `${dish[i].name} ${dish[i].price}₽`;
                dishChoiceValueElements[1].value = dish[i].keyword;
                    
                break;
            case 'beverages':
                dishChoiceNameElements[2].textContent = `${dish[i].name} ${dish[i].price}₽`;
                dishChoiceValueElements[2].value = dish[i].keyword;
                break;
            }
        }
    }
    orderSumCalc();

    if (formEmpty) {
        formgroupDishchoice.forEach((element) => {
            element.style.display = 'inherit';
        });
        orderAmountElement.style.display = 'inherit';
        formEmpty = false;
    }
};

document.addEventListener('click', (event) =>{
    if (event.target.tagName === "BUTTON" && event.target.closest('.food-card')) {
        updateFormData(event.target.offsetParent.dataset);
        const foodCard = event.target.closest('.food-card'); 
        document.querySelectorAll('.food-card').forEach((card) => {
            const isSelectedInForm = Array.from(dishChoiceValueElements).some(
                (element) => element.value === card.dataset.dish
            );

            if (!isSelectedInForm && card !== foodCard) {
                card.classList.remove('active');
            }
        });
        if (!foodCard.classList.contains('active')) {
            foodCard.classList.add('active');
        }
    }

    if (event.target.type === "reset" && event.target.closest('form')) {
        onFormReset();
    }
});


onFormReset();