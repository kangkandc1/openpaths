export const assignColorToLevel = (Level:number) => {

    let assignedColor = '#000000'


    switch (Level) {
        case 0:
            assignedColor = "#1E90FF"
            break;
        case 1:
            assignedColor = "#fa8202"
            break;
        case 2:
            assignedColor = '#ee0af2';
            break;

        case 3:

            assignedColor = '#e7b3e8'
            break;

       

        case 4:
            assignedColor = '#5b355c';
            break;

        case 5:
            assignedColor = '#520354'
            break;

        case -1:
            assignedColor = '#fa140c';
            break;

        case -2:
            assignedColor = '#6e0602'
            break;

        case -3:
            assignedColor = '#663331';
            break;

        case -4:
            assignedColor = '#450705'
            break;

        case -5:
            assignedColor = '#8f6a68';
            break;






        default:
            console.log("Level not in range")
    }


    return assignedColor




}