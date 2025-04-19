'use strict';

const dishcathegoryElements = document.querySelectorAll('.grid-container');

const getNewImageElement = (srcImage, altImage) => {
    const newImageElement = document.createElement('img');
    newImageElement.src = srcImage;
    newImageElement.alt = altImage;
    
    return newImageElement;
};

const getNewParagraphElement = (text, className) => {
    const newParagraphElement = document.createElement('p');
    newParagraphElement.className = className;
    newParagraphElement.textContent = text;
    return newParagraphElement;
};

const getNewButtonElement = () => {
    const newButtonElement = document.createElement('button');
    newButtonElement.textContent = 'Добавить';
    return newButtonElement;
};


const getNewDishcard = (dish) => {
    const newDishcard = document.createElement('div');
    newDishcard.className = 'food-card';
    newDishcard.dataset.dish = dish.keyword;
    newDishcard.append(getNewImageElement(dish.image, dish.name));
    newDishcard.append(getNewParagraphElement(dish.price + '₽', "price"));
    newDishcard.append(getNewParagraphElement(dish.name, "name"));
    newDishcard.append(getNewParagraphElement(dish.count, "weight"));
    newDishcard.append(getNewButtonElement());
    return newDishcard;
};

dish.sort((a, b) => a.name > b.name);

//Помещение созданного элемента в нужную секцию
dish.forEach((item, i) => {
    const newDishcard = getNewDishcard(item, i);
    switch (item.category) {
    case 'soup':
        dishcathegoryElements[0].append(newDishcard);
        break;
    case 'main_course':
        dishcathegoryElements[1].append(newDishcard);
        break;
    case 'beverages':
        dishcathegoryElements[2].append(newDishcard);
        break;
    }
});