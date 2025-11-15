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
export const assignColorToPathwayMode = (mode: number): string => {
    // PathwayModes enum:
    // Walkway = 1, Stairs = 2, Moving sidewalk/travelator = 3,
    // Escalator = 4, Elevator = 5, Fare Gate = 6, Ramp = 7

    let assignedColor = '#000000';

    switch (mode) {
        case 1: // Walkway ("way")
            assignedColor = "#0f0f0f";
            break;
        case 7: // Ramp
            assignedColor = "#c116b2";
            break;
        case 5: // Elevator
            assignedColor = "#08d41c";
            break;
        case 4: // Escalator
            assignedColor = "#E49B0F";
            break;
        case 2: // Stairs
        case 3: // Moving sidewalk/travelator
        case 6: // Fare Gate
        default:
            assignedColor = "#fe3105";
            break;
    }

    return assignedColor;
};
