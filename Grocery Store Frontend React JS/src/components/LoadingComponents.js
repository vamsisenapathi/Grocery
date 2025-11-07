import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Backdrop, 
  Typography, 
  Button,
  Card,
  CardContent,
  Skeleton,
  Grid,
  Fade,
  LinearProgress
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
// import { styled } from '@mui/material/styles'; // For future enhancements

// ============ ENHANCED LOADING ANIMATIONS ============

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

// Animation for future enhancements
/* const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`; */

// Styled skeleton base (for future use)
// const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
//   animation: `${shimmer} 2s ease-in-out infinite`,
//   background: `linear-gradient(90deg, ${theme.palette.grey[200]} 0px, ${theme.palette.grey[100]} 40px, ${theme.palette.grey[200]} 80px)`,
//   backgroundSize: '200px 100%',
//   borderRadius: theme.shape.borderRadius,
// }));

// ============ 1. PAGE LOADER (Full page loading) ============
export const PageLoader = ({ message = "Loading...", variant = "default" }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: 2,
        textAlign: 'center',
        px: 2
      }}
    >
      <CircularProgress 
        size={variant === "large" ? 60 : 40} 
        thickness={4}
        sx={{ 
          color: 'primary.main',
          animation: `${pulse} 2s ease-in-out infinite`
        }}
      />
      <Typography 
        variant={variant === "large" ? "h6" : "body1"} 
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
      {variant === "large" && (
        <Typography variant="body2" color="text.disabled">
          Please wait while we fetch the data...
        </Typography>
      )}
    </Box>
  );
};

// ============ 2. ACTION LOADER (For specific actions) ============
export const ActionLoader = ({ 
  message = "Loading...", 
  size = "small",
  inline = false,
  showProgress = false,
  progress = 0
}) => {
  const content = (
    <>
      <CircularProgress 
        size={size === "large" ? 24 : 16} 
        thickness={4}
        sx={{ mr: 1 }}
      />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </>
  );

  if (inline) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {content}
      </Box>
      {showProgress && (
        <Box sx={{ width: '200px', mt: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {progress}% Complete
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ============ 3. BUTTON LOADER (For button loading states) ============
export const ButtonLoader = ({ 
  loading = false, 
  children, 
  size = "medium",
  variant = "contained",
  color = "primary",
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={loading || disabled}
      onClick={loading ? undefined : onClick}
      startIcon={
        loading ? (
          <CircularProgress 
            size={16} 
            sx={{ color: 'inherit' }}
          />
        ) : props.startIcon
      }
      sx={{
        minWidth: loading ? 120 : 'auto',
        ...(loading && {
          opacity: 0.7,
          cursor: 'not-allowed'
        }),
        ...props.sx
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

// ============ 4. SKELETON LOADERS ============

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" height={32} width="80%" animation="wave" />
      <Skeleton variant="text" height={24} width="100%" animation="wave" />
      <Skeleton variant="text" height={24} width="60%" animation="wave" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Skeleton variant="text" height={28} width="40%" animation="wave" />
        <Skeleton variant="rectangular" height={36} width={100} animation="wave" />
      </Box>
    </CardContent>
  </Card>
);

// Products Grid Skeleton
export const ProductsGridSkeleton = ({ count = 8 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <ProductCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

// Category Navigation Skeleton
export const CategoryNavSkeleton = () => (
  <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden', py: 1 }}>
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton 
        key={index}
        variant="rounded" 
        width={120} 
        height={40} 
        animation="wave"
        sx={{ flexShrink: 0 }}
      />
    ))}
  </Box>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rectangular" width={80} height={80} animation="wave" />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" height={24} width="70%" animation="wave" />
          <Skeleton variant="text" height={20} width="50%" animation="wave" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Skeleton variant="text" height={24} width="30%" animation="wave" />
            <Skeleton variant="rectangular" height={32} width={100} animation="wave" />
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ============ 5. FULL SCREEN LOADER ============
export const FullScreenLoader = ({ 
  open = false, 
  message = "Loading...", 
  onClose = null,
  variant = "default"
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      }}
      open={open}
      onClick={onClose}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          textAlign: 'center',
          p: 4,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <CircularProgress 
          size={variant === "large" ? 80 : 60} 
          thickness={4}
          sx={{ color: 'white' }}
        />
        <Typography variant="h6" color="white" sx={{ mt: 2 }}>
          {message}
        </Typography>
        {onClose && (
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
            Click anywhere to cancel
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

// ============ 6. SUSPENSE FALLBACK ============
export const SuspenseFallback = ({ message = "Loading component..." }) => (
  <Fade in={true} timeout={300}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        gap: 2
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  </Fade>
);

// ============ 7. INLINE LOADING INDICATOR ============
export const InlineLoader = ({ 
  text = "Loading", 
  dots = true,
  size = "small"
}) => {
  const [dotCount, setDotCount] = React.useState(0);

  React.useEffect(() => {
    if (!dots) return;
    
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);
    
    return () => clearInterval(interval);
  }, [dots]);

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={size === "large" ? 20 : 16} />
      <Typography variant="body2" color="text.secondary">
        {text}{dots ? '.'.repeat(dotCount) : ''}
      </Typography>
    </Box>
  );
};

// ============ 8. ERROR STATE WITH RETRY ============
export const ErrorState = ({ 
  title = "Something went wrong", 
  message = "Please try again", 
  onRetry,
  retryText = "Retry",
  showHomeButton = false,
  onHome
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      py: 4,
      gap: 2
    }}
  >
    <Typography variant="h6" color="error.main">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      {onRetry && (
        <Button variant="contained" onClick={onRetry} size="small">
          {retryText}
        </Button>
      )}
      {showHomeButton && onHome && (
        <Button variant="outlined" onClick={onHome} size="small">
          Go Home
        </Button>
      )}
    </Box>
  </Box>
);

// ============ 9. LOADING OVERLAY ============
export const LoadingOverlay = ({ 
  loading = false, 
  children, 
  message = "Loading...",
  blur = false
}) => (
  <Box sx={{ position: 'relative' }}>
    {loading && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          ...(blur && {
            backdropFilter: 'blur(2px)'
          })
        }}
      >
        <ActionLoader message={message} />
      </Box>
    )}
    <Box sx={{ ...(loading && { filter: 'blur(1px)', pointerEvents: 'none' }) }}>
      {children}
    </Box>
  </Box>
);

// ============ 10. SEARCH LOADING STATE ============
export const SearchLoader = ({ 
  searching = false, 
  query = "",
  resultsCount = 0 
}) => {
  if (!searching) return null;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      py: 2,
      px: 1,
      background: 'action.hover',
      borderRadius: 1
    }}>
      <CircularProgress size={16} />
      <Typography variant="body2" color="text.secondary">
        Searching for "{query}"...
      </Typography>
    </Box>
  );
};

export default PageLoader;