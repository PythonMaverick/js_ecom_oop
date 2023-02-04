class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }

    setAvailable(isAvailable) {
      this.available = isAvailable;
    }
}

class GoodsList {
    #goods = [];
    constructor() {
        this.filter = null;
        this.sortPrice = false;
        this.sortDir = true;
    }

    get list() {
        let goods = this.#goods.filter(good => this.filter ? this.filter.test(good.name) : true);
        if (this.sortPrice) {
            goods = goods.sort((a, b) => (this.sortDir ? a.price - b.price : b.price - a.price));
        }
        return goods;
    }

    add(good) {
        this.#goods.push(good);
    }

    remove(id) {
        this.#goods = this.#goods.filter(good => good.id !== id);
    }
}

class BasketGood extends Good {
    constructor(good, amount) {
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount;
    }
}

class Basket {
    constructor() {
        this.goods = [];
    }

    get totalAmount() {
        let amount = 0;
        this.goods.forEach(good => amount += good.price * good.amount);
        return amount;
    }

    get totalSum() {
        let sum = 0;
        this.goods.forEach(good => sum += good.amount);
        return sum;
    }

    add(good, amount) {
        let basketGood = this.goods.find(g => g.id === good.id);
        if (basketGood) {
            basketGood.amount += amount;
        } else {
            this.goods.push(new BasketGood(good, amount));
        }
    }

    remove(good, amount) {
        let basketGood = this.goods.find(g => g.id === good.id);
        if (basketGood) {
            basketGood.amount -= amount;
            if (basketGood.amount <= 0) {
                this.goods = this.goods.filter(g => g.id !== good.id);
            }
        }
    }

    clear() {
        this.goods = [];
    }

    removeUnavailable() {
        this.goods = this.goods.filter(good => good.available);
    }
}


// testing
let tShirt = new Good(1001, 'T-Shirt', 'White Man"s T-Shirt', ['S', 'M', 'L', 'XL'], 25.99, true);
let jeans = new Good(1002, 'Blue Jeans', 'Blue Man"s Jeans', ['32', '34', '36', '38'], 89.99, true);
let hat = new Good(1003, 'Black Hat', 'Unisex Hat', ['M', 'L', 'XL'], 19.99, true);
let shoes = new Good(1004, 'Shoes', 'Sneakers Nike', ['39', '40', '41'], 109.99, false);
let jacket = new Good(1005, 'Pullover', 'Black Pullover Unisex', ['S', 'M', 'L', 'XL'], 399.99, true);


let goodsList = new GoodsList([tShirt, jeans, hat, shoes, jacket]);
goodsList.filter = /T-Shirt/;
goodsList.sortPrice = true;
goodsList.sortDir = false;

let basket = new Basket();
basket.add(tShirt, 5);
basket.add(jeans, 3);
basket.add(hat, 1);

console.log('Filtered and sorted catalog of products: ');
console.log(goodsList.list);
console.log('Total amount:', basket.totalAmount);
console.log('Total sum:', basket.totalSum);

basket.remove(hat, 1);
basket.remove(tShirt, 2);
basket.removeUnavailable();

console.log('Basket after removing items:');
console.log(basket.goods);
console.log('Total amount:', basket.totalAmount);
console.log('Total sum:', basket.totalSum);

basket.clear();

console.log('Basket after clearing:');
console.log(basket.goods);
console.log('Total amount:', basket.totalAmount);
console.log('Total sum:', basket.totalSum);

