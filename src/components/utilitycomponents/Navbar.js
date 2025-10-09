import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom";


import { useEffect } from "react";

import { useState } from "react";





export const Navbar = () => {

  

 
  return (
    
      
       <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <span className='navbar-brand'>Openpaths</span>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavDropdown'
          aria-controls='navbarNavDropdown'
          aria-expanded='false'
          aria-label='Toggle Navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        
      </div>
    </nav>
    
  );
};
