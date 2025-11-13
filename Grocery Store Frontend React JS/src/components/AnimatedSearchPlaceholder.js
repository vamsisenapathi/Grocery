import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const productNames = ['sugar', 'milk', 'eggs', 'rice', 'bread', 'vegetables', 'fruits', 'snacks'];

const AnimatedSearchPlaceholder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % productNames.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        overflow: 'hidden',
        height: '20px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '20px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out',
            transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
            opacity: isAnimating ? 0 : 1,
          }}
        >
          Search "{productNames[currentIndex]}"
        </Typography>
      </Box>
    </Box>
  );
};

export default AnimatedSearchPlaceholder;
