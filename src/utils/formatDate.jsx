const formatDate = {
  formatJsonToDate: (date) => {
    return new Date(date).toLocaleDateString("en-GB")
  }
}

export default formatDate;