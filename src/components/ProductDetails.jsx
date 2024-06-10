import { useState, useEffect } from "react";
import { Modal, Box, Typography, Skeleton, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

function ProductDetails({
  openModal,
  handleProductClose,
  selectedProduct,
  apiUrl,
}) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/${selectedProduct}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error Fecthing products: ", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500); //SIMULATE LOADING SCREEN REMOVE TO MAKE LOADING FASTER
      }
    };
    fetchProduct();
  }, [selectedProduct]);

  return (
    <Modal open={openModal} onClose={handleProductClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "white",
          boxShadow: 24,
          p: 2,
          borderStyle: "none",
          borderRadius: "10px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "flex-start",
          gap: "20px",
        }}
      >
        <Box width="1">
          {loading ? (
            <>
              <Skeleton variant="text" width={100} height={30} />
              <Skeleton variant="text" width={250} height={30} />
            </>
          ) : (
            <>
              <Typography
                variant="subtitle2"
                textTransform={"uppercase"}
                width="1"
              >
                {product.category}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleProductClose}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <Close />
              </IconButton>
              <Typography variant="h5" width="1">
                {product.title}
              </Typography>
            </>
          )}
        </Box>
        {loading ? (
          <Box width={1}>
            <Skeleton variant="text" width="100%" height={30} />
            <Skeleton variant="text" width="100%" height={30} />
            <Skeleton variant="text" width={100} height={30} />
          </Box>
        ) : (
          <Typography variant="body2" width="1">
            {product.description}
          </Typography>
        )}

        {loading ? (
          <Skeleton variant="text" width={50} height={30} />
        ) : (
          <Typography variant="body1" fontWeight="bold" width="1">
            ₱{product.price}
          </Typography>
        )}

        <Box
          width="1"
          display="flex"
          gap="10px"
          bgcolor={grey[50]}
          padding={2}
          borderRadius="10px"
          flexWrap="wrap"
        >
          <Typography
            fontWeight="800"
            textTransform={"uppercase"}
            width="100%"
            component="p"
            fontSize="small"
          >
            More Images
          </Typography>
          {loading ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={100}
                  height={100}
                  sx={{ marginRight: "10px" }}
                />
              ))}
            </>
          ) : product && product.images ? (
            <>
              {product.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`product-image-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                  }}
                />
              ))}
            </>
          ) : (
            <Typography variant="h6" color="red">
              No images available.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default ProductDetails;
