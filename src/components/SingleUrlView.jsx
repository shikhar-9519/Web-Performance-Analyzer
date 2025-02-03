import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { fetchCruxData } from "../services/cruxApi";
import WebVitalCard from "./WebVitalCard";
import { toast } from "react-toastify";

const SingleURLView = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

const handleSearch = async () => {
    const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.~:/?#[\]@!$&'()*+,;=]*)?$/i;
    
    if (!pattern.test(url)) {
        alert(`${url} is not a valid URL. Please correct it.`);
        return;
    }

    setLoading(true);
    try {
        const response = await fetchCruxData(url);
        setData(response);
    } catch (error) {
        setData(null);
        toast.error('Failed to fetch CrUX data');
        console.error(error);
    }
    setLoading(false);
};

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !url.trim()}
        >
          Analyze
        </Button>
      </Box>

      {loading ? <CircularProgress /> : data && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Core Web Vitals
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <WebVitalCard
              title="Largest Contentful Paint (LCP)"
              detail={data.record.metrics.largest_contentful_paint}
              id={"largest_contentful_paint"}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <WebVitalCard
              title="Cumulative Layout Shift (CLS)"
              detail={data.record.metrics.cumulative_layout_shift}
              id={"cumulative_layout_shift"}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <WebVitalCard
              title="First Contentful Paint (FCP)"
              detail={data.record.metrics.first_contentful_paint}
              id={"first_contentful_paint"}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <WebVitalCard
              title="Time to First Byte (TTFB)"
              detail={data.record.metrics.experimental_time_to_first_byte}
              id={"experimental_time_to_first_byte"}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <WebVitalCard
              title="Interaction to Next Paint (INP)"
              detail={data.record.metrics.interaction_to_next_paint}
              id={"interaction_to_next_paint"}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SingleURLView;
