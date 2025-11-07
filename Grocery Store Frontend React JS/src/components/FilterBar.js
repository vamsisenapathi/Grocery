import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchTerm,
  setSortBy,
  clearFilters,
} from '../redux/actions/productActions';

const FilterBar = () => {
  const dispatch = useDispatch();
  
  const storeData = useSelector((state) => {
    return {
      filters: state?.products?.filters,
      totalProducts: state?.products?.items?.length || 0,
    };
  });

  const { filters, totalProducts } = storeData;

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    dispatch(setSearchTerm(searchTerm));
  };

  const handleSortChange = (event) => {
    const sortBy = event.target.value;
    dispatch(setSortBy(sortBy));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        {/* Left side - Title and product count */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" component="h1" color="primary" fontWeight="bold">
            All Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({totalProducts} items)
          </Typography>
        </Box>

        {/* Right side - Search and Sort */}
        <Box display="flex" gap={2} alignItems="center" sx={{ minWidth: { xs: '100%', md: 'auto' } }}>
          {/* Search Field */}
          <TextField
            placeholder="Search products..."
            value={filters?.searchTerm || ''}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ 
              minWidth: { xs: '100%', md: 250 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Sort By Dropdown */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={filters?.sortBy || 'name'}
              label="Sort By"
              onChange={handleSortChange}
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon color="action" sx={{ ml: 1 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>

          {/* Clear Filters Button */}
          {(filters?.searchTerm || (filters?.sortBy && filters?.sortBy !== 'name')) && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ 
                minWidth: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {/* Active Filters Display */}
      {(filters?.searchTerm || (filters?.sortBy && filters?.sortBy !== 'name')) && (
        <Box mt={2} display="flex" flexWrap="wrap" gap={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Active filters:
          </Typography>
          {filters?.searchTerm && (
            <Typography variant="caption" sx={{ 
              backgroundColor: 'primary.light', 
              color: 'primary.contrastText',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem'
            }}>
              Search: "{filters.searchTerm}"
            </Typography>
          )}
          {filters?.sortBy && filters?.sortBy !== 'name' && (
            <Typography variant="caption" sx={{ 
              backgroundColor: 'primary.light', 
              color: 'primary.contrastText',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem'
            }}>
              Sort: {filters.sortBy === 'price-asc' ? 'Price (Low to High)' : 
                     filters.sortBy === 'price-desc' ? 'Price (High to Low)' : 'Name'}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default FilterBar;