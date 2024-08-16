<template>
  <div class="card">
    <div class="card__title-wrapper">
      <h2 class="card__title">
        {{ `${city.city.name}, ${city.city.country} ` }}
      </h2>
      <div>
        <img
          @click.stop="removeCity(city)"
          :src="`/assets/images/close.svg`"
          class="card__remove"
          alt="remove
        icon"
        />
        <img
          @click.stop="addToFavorites(city)"
          :src="`/assets/images/heart-${isFavorite ? 'filled' : 'empty'}.png`"
          class="card__heart"
          alt="heart icon"
        />
      </div>
    </div>
    <div class="card__temperature-wrapper">
      <div class="card__icon-part-wrapper">
        <img
          class="weather-icon"
          :src="`https://openweathermap.org/img/wn/${city.list[0].icon}@2x.png`"
          alt="weather icon"
        />
        <p class="card__paragraph">
          Humidity: {{ city.list[0].humidity }}% <br />
          Wind: {{ city.list[0].wind }}km/h
        </p>
      </div>

      <h2 class="card__temperature">{{ city.list[0].averageTemperature }}°</h2>
    </div>

    <table v-if="period !== 'Day'">
      <tr>
        <td v-for="day in city.list" :key="day.date">{{ day.weekDay }}</td>
      </tr>
      <tr>
        <td v-for="day in city.list" :key="day.date">{{ day.averageTemperature }}°</td>
      </tr>
      <tr>
        <td v-for="day in city.list" :key="day.date">
          <img
            class="weather-icon-small"
            :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
            alt="weather icon"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "CityCard",
  props: {
    city: {
      type: Object,
      default: null,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    period: {
      type: String,
      default: "Day",
    },
  },
  methods: {
    addToFavorites(card) {
      this.$emit("add-favorite", card);
    },
    removeCity(city) {
      this.$emit("remove-city", city);
    },
  },
  computed: {
    filterListByToday() {
      const currentDate = new Date().toISOString().slice(0, 10);
      const filterListByToday = this.city.list.filter((obj) => obj.dt_txt.includes(currentDate));
      return filterListByToday;
    },
  },
};
</script>

<style scoped lang="scss">
@import url(https://fonts.googleapis.com/css?family=Roboto:400,300);
html,
body {
  background-color: #f3f3f3;
  font-family: "Roboto", sans-serif;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: fit-content;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);
  -webkit-animation: open 0.5s cubic-bezier(0.39, 0, 0.38, 1);
  border: 1px solid transparent;
  cursor: pointer;

  &__active,
  &:hover {
    box-shadow: 1px 2px 10px rgb(50, 68, 131);
    border: 1px solid rgba(48, 81, 124, 0.9);
  }

  &__title-wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-weight: 300;
    font-size: 30px;
    margin: 0 0 10px;
    -webkit-animation: open 0.5s cubic-bezier(0.39, 0, 0.38, 1);
  }

  &__heart {
    max-width: 30px;
    max-height: 30px;

    &:hover {
      scale: 1.1;
    }
  }

  &__subtitle {
    float: left;
    margin: 0;
    color: #777;
    font-weight: 400;
    font-size: 1em;
    -webkit-animation: open 0.5s cubic-bezier(0.39, 0, 0.38, 1) 0.1s;
  }

  &__paragraph {
    color: #777;
    font-weight: 400;
    line-height: 1.2;
  }

  &__temperature-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  &__temperature {
    float: right;
    color: #666;
    font-weight: 300;
    font-size: 66px;
    line-height: 1.1;
    margin: 0;
    -webkit-animation: open 0.5s cubic-bezier(0.39, 0, 0.38, 1) 0.2s;
  }
  &__icon-part-wrapper {
    display: flex;
    align-items: center;
    width: 200px;
  }
}

.card__remove {
  opacity: 0;
  max-width: 30px;
  max-height: 30px;

  &:hover {
    scale: 1.1;
  }
}

.card:hover .card__remove {
  opacity: 1;
}

@-webkit-keyframes open {
  from {
    padding: 0 30px;
    height: 0;
  }
  to {
    height: 230px;
  }
}

h1,
h2,
h3,
h4 {
  position: relative;
}

span {
  color: #999;
  font-weight: 300;
}

span span {
  margin-left: 0;
}

.dot {
  font-size: 0.9em;
}

.weather-icon {
  position: relative;
  width: 70px;
  height: 70px;
  -webkit-animation: open 0.5s cubic-bezier(0.39, 0, 0.38, 1) 0.2s;

  &-small {
    width: 50px;
    height: 50px;

    @include onMobile {
      width: 40px;
      height: 40px;
    }
  }
}

@-webkit-keyframes open {
  0% {
    opacity: 0;
    -webkit-transform: translateY(15px);
  }
  50% {
    opacity: 0;
    -webkit-transform: translateY(15px);
  }
  99% {
    -webkit-animation-play-state: paused;
  }
  100% {
    opacity: 1;
  }
}

table {
  position: relative;
  top: 10px;
  width: 100%;
  text-align: center;

  @include onTablet {
    font-size: 15px;
  }
}

tr:nth-child(1) td:nth-child(1),
tr:nth-child(1) td:nth-child(2),
tr:nth-child(1) td:nth-child(3),
tr:nth-child(1) td:nth-child(4),
tr:nth-child(1) td:nth-child(5) {
  padding-bottom: 14px;
  -webkit-animation: up 2s cubic-bezier(0.39, 0, 0.38, 1) 0.7s;
}

tr:nth-child(2) td:nth-child(1),
tr:nth-child(2) td:nth-child(2),
tr:nth-child(2) td:nth-child(3),
tr:nth-child(2) td:nth-child(4),
tr:nth-child(2) td:nth-child(5) {
  padding-bottom: 7px;
  -webkit-animation: up 2s cubic-bezier(0.39, 0, 0.38, 1) 0.9s;
}

tr:nth-child(3) td:nth-child(1),
tr:nth-child(3) td:nth-child(2),
tr:nth-child(3) td:nth-child(3),
tr:nth-child(3) td:nth-child(4),
tr:nth-child(3) td:nth-child(5) {
  padding-bottom: 7px;
  -webkit-animation: up 2s cubic-bezier(0.39, 0, 0.38, 1) 0.9s;
}

tr:nth-child(2),
tr:nth-child(3) {
  font-size: 0.9em;
}

tr:nth-child(3) {
  color: #999;
}
</style>
