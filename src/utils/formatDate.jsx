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
        return `${time} - ${day}`;
    },

    formatJsonToDateTimeMinus7Hour: (date) => {
        const originalDate = new Date(date);
        const updatedDate = new Date(originalDate.getTime() - 7 * 60 * 60 * 1000);

        const hours = String(updatedDate.getHours()).padStart(2, '0');
        const minutes = String(updatedDate.getMinutes()).padStart(2, '0');
        const day = String(updatedDate.getDate()).padStart(2, '0');
        const month = String(updatedDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = updatedDate.getFullYear();

        return <div>{`${hours}:${minutes} - ${day}/${month}/${year}`}</div>;
    },

    formatJsonToDateInput(date) {
        if (!date) return "";
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    },

    formatDateToDateTime(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        return date.toISOString();
    }

}

export default formatDate;