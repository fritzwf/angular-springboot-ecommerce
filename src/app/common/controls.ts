const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];

export class Month {
    monthDate: number;
    monthName: string;

    constructor(dateNum: number) {
        this.monthDate = dateNum;
        this.monthName = monthNames[dateNum - 1];
    }

    getMonthControlDisplay(): string {
        return (this.monthDate.toString().length < 2 ?
            '0' + this.monthDate.toString() : this.monthDate.toString()) +
            ' – ' + this.monthName;
    }

    // getMonthControlDisplay(showMonthOnly?: boolean): string {
    //     const monthDisplay =
    //         showMonthOnly ? this.monthName : (this.monthDate.toString().length < 2 ?
    //         '0' + this.monthDate.toString() : this.monthDate.toString()) +
    //         ' – ' + this.monthName;

    //     return monthDisplay;
    // }
}
