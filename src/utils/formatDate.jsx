const formatDate = {
  formatJsonToDate: (date) => {
    return new Date(date).toLocaleDateString("en-GB")
  },

  formatJsonToDateTime: (date) => {
    const d = new Date(date);
    const time = d.toLocaleTimeString("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const day = d.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return `${time} - ${day}`;  }
}

export default formatDate;