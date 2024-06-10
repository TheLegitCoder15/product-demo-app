import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Skeleton,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material";
import { useState, useEffect, React } from "react";
import ProductDetails from "./components/ProductDetails";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(1);

  const [searchField, setSearchField] = useState("");

  const apiUrl = "https://dummyjson.com/products";

  const theme = createTheme({
    // CUSTOMIZING MUI STYLES
    components: {
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: grey[100],
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (searchField != "") {
        try {
          const response = await fetch(`${apiUrl}/search?q=${searchField}`);
          const data = await response.json();
          setProducts(data.products);
        } catch (error) {
          console.error("Error Fecthing products: ", error);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 1500); //SIMULATE LOADING SCREEN REMOVE TO MAKE LOADING FASTER
        }
      } else {
        try {
          const response = await fetch(`${apiUrl}?limit=0`);
          const data = await response.json();
          setProducts(data.products);
        } catch (error) {
          console.error("Error Fecthing products: ", error);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 1500); //SIMULATE LOADING SCREEN REMOVE TO MAKE LOADING FASTER
        }
      }
    };
    fetchProducts();
  }, [searchField]);

  const handleChangePage = (event, newPage) => {
    // FUNCTION FOR HANDLING PAGE CHANGE

    setPage(newPage);
    setLoading(false);
  };

  const handleChangeRowsPerPage = (event) => {
    // FUNCTION FOR HANDLING DISPLAYED ITEMS PER PAGE
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
    setLoading(false);
  };

  const handleProductClick = (id) => {
    // FUNCTION FOR DISPLAYING MODAL PRODUCT DETAILS
    setSelectedProduct(id);
    setOpenModal(true);
  };
  const handleProductClose = () => {
    // FUNCTION FOR CLOSING MODAL
    setOpenModal(false);
  };

  const productLoadingSkeleton = () => {
    // FUNCTION FOR GENERATING SKELETON LOADING
    const skeletons = [];
    for (let i = 0; i < rowsPerPage; i++) {
      skeletons.push(
        <TableRow key={i}>
          <TableCell>
            <Skeleton variant="rounded" width={100} height={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} height={30} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} height={30} />
          </TableCell>
        </TableRow>
      );
    }
    return skeletons;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box padding="10px" width="1" height="1">
        <Box
          width="1"
          height="auto"
          textAlign="center"
          fontWeight="bold"
          bgcolor="primary.main"
          color="white"
          padding="10px"
        >
          PRODUCTS DEMO
        </Box>
        <Box width="1" height="auto" paddingY={1}>
          <OutlinedInput
            variant="outlined"
            placeholder="Search Product"
            fullWidth
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
              setPage(0);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearchField("");
                  }}
                  sx={{ "&:hover": { borderRadius: "10px" } }}
                >
                  <Typography fontSize="small">Clear</Typography>
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
        <Box
          className="product-list"
          width="1"
          height="1"
          paddingX={8}
          paddingY={4}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: grey[200] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Thumbnail</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  productLoadingSkeleton()
                ) : products.length > 0 ? (
                  products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <TableRow
                        key={product.title}
                        onClick={() => {
                          handleProductClick(product.id);
                        }}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { backgroundColor: grey[100] },
                        }}
                      >
                        <TableCell>
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            style={{ width: 100, height: 100 }}
                          />
                        </TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{`₱${product.price}`}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      No products matched your search keyword.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20, { label: "All", value: -1 }]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Box>
      <ProductDetails
        openModal={openModal}
        handleProductClose={handleProductClose}
        selectedProduct={selectedProduct}
        apiUrl={apiUrl}
      />
    </ThemeProvider>
  );
}

export default App;
