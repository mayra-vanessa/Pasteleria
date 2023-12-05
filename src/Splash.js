// Splash.js
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0); /* Posición inicial y final */
  }
  40% {
    transform: translateY(-20px); /* Pico de la animación hacia arriba */
  }
  60% {
    transform: translateY(-10px); /* Pico de la animación hacia abajo */
  }
`;

const SplashContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #FF90BB;
`;

const BouncingImage = styled.div`
  animation: ${bounce} 1s infinite;
  text-align: center;
`;

const Image = styled.img`
  max-width: 91%;
  max-height: 91%;
`;

const Splash = ({ onSplashComplete }) => {
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      onSplashComplete();
    }, 2000);

    return () => clearTimeout(splashTimeout);
  }, [onSplashComplete]);

  return (
    <SplashContainer>
      <BouncingImage>
        <Image
          src="images/logo_pasteleria.png"
          alt="Logo de Pastelería Mayra"
        />
      </BouncingImage>
    </SplashContainer>
  );
};

export default Splash;
