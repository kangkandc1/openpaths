import { Icon } from 'react-icons-kit';
import { home, phone, location, mail3 } from 'react-icons-kit/icomoon';

export const Footer = () => {
    return (
        <div className="main-color">
            <footer className="container d-flex flex-column flex-md-row justify-content-between align-items-center py-2">
                <div className="text-white small">
                    <h5 className="mb-1"></h5>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Icon_DINA_Schwerpunkte_Parldigi_01_Open_Source_Software_Schwarz.svg/1024px-Icon_DINA_Schwerpunkte_Parldigi_01_Open_Source_Software_Schwarz.svg.png?20171124231829"
                    alt="Open Source" width={24} height={24} />

                <div className="text-center text-md-end small">
                    <span>Open Source Graph Modelling Tool</span>
                </div>
            </footer>
        </div>
    );
};
