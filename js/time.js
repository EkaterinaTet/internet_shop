//счетчик времени
const days = document.querySelector("#days");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const countdown = document.querySelector("#countdown");

const currentYear = new Date().getFullYear(); //вернет текущий год - 2023
const nextYear = new Date(`January 01 ${currentYear + 1} 00:00:00`); //считаю следующий год

//обновление счетчика каждую секунду
function updateCounter() {
  const currentTime = new Date(); // текущее время
  const differents = nextYear - currentTime; //разница между новым годом и текущем временем (в милисекундах)
  //перевод в секунды/минуты/часы/дни
  //Перевод в дни:
  const daysLeft = Math.floor(differents / 1000 / 60 / 60 / 24); //делю на 1000 - получаю секунды, делю секунды на 60 - получаю минуты, делю еще раз на 60 - получаю часы, делю еще на 24 - получаю сутки.
  //Перевод в часы:
  const hoursLeft = Math.floor(differents / 1000 / 60 / 60) % 24; //беру остаток от деления на 24 (сколько доп. часов без учета полных дней)
  //Минут всего,далее остаток от преобразования в часы, минут осталось
  const minutesLeft = Math.floor(differents / 1000 / 60) % 60;
  //Секунд всего,далее остаток от преобразования в минуты, секунд осталось
  const secondsLeft = Math.floor(differents / 1000) % 60;

  // если число было меньше 10, то добавляется спереди 0. - 07, 02, 06 и тд.
  days.innerText = daysLeft;
  hours.innerText = hoursLeft < 10 ? "0" + hoursLeft : hoursLeft;
  minutes.innerText = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;
  seconds.innerText = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
}
updateCounter();
//запускаю эту ф-цию каждую секунду, чтобы значения менялись сами
setInterval(updateCounter, 1000);
