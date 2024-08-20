export default function calculateAverageTemperature(list) {
  const result = [];
  const dates = {};

  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];

    const newDate = new Date(date);
    const options = { weekday: "long" };

    if (!dates[date]) {
      dates[date] = {
        date: date,
        temperatures: [item.main.temp],
        icon: item.weather[0].icon,
        weekDay: newDate.toLocaleDateString("en-US", options).substr(0, 3).toUpperCase(),
        humidity: item.main.humidity,
        wind: item.wind.speed.toFixed(0),
      };
    } else {
      dates[date].temperatures.push(item.main.temp);
    }
  }

  for (const date in dates) {
    const temperatures = dates[date].temperatures;
    const averageTemperature = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    dates[date].averageTemperature = averageTemperature.toFixed(0);
    result.push(dates[date]);
  }

  return result;
}
