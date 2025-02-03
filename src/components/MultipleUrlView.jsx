import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { Plus, X } from "lucide-react";
import { fetchCruxData, transformCruxData } from "../services/cruxApi";

const MultipleURLView = () => {
  const [urls, setUrls] = useState([""]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const calculateSummary = (data) => {
    if (!data?.length) return null;

    const summary = {
      avgCls: 0,
      avgFcp: 0,
      avgLcp: 0,
      avgTtfb: 0,
      avgInp: 0,
    };

    data.forEach((item) => {
      summary.avgCls += parseFloat(item.cls) || 0;
      summary.avgFcp += parseFloat(item.fcp) || 0;
      summary.avgLcp += parseFloat(item.lcp) || 0;
      summary.avgTtfb += parseFloat(item.ttfb) || 0;
      summary.avgInp += parseFloat(item.inp) || 0;
    });

    Object.keys(summary).forEach((key) => {
      summary[key] = (summary[key] / data.length).toFixed(2);
    });

    return summary;
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const validUrls = urls.filter((url) => url.trim());    
      const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.~:/?#[\]@!$&'()*+,;=]*)?$/i;
      for (const url of validUrls) {
        if (!pattern.test(url)) {
          alert(`${url} is not a valid URL. Please correct it.`);
          setLoading(false);
          return;
        }
      }
      const promises = validUrls.map((url) => fetchCruxData(url));
      const responses = await Promise.allSettled(promises);
      const fulfilledResponses = responses.filter(response => response.status === "fulfilled");
      const transformedData = fulfilledResponses.map((response) =>
        transformCruxData(response)
      );
      setResults(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortColumn(column);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedResults = sortColumn
    ? [...results].sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        return (valA < valB ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
      })
    : results;

  const summary = calculateSummary(results);

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {urls.map((url, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              label={`URL ${index + 1}`}
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              variant="outlined"
              placeholder="https://example.com"
            />
            {urls.length > 1 && (
              <IconButton
                onClick={() => removeUrlField(index)}
                sx={{ color: "error.main" }}
              >
                <X />
              </IconButton>
            )}
          </Stack>
        ))}
        <Box>
          <Button
            startIcon={<Plus size={20} />}
            onClick={addUrlField}
            variant="outlined"
            size="small"
          >
            Add URL
          </Button>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || urls.every((url) => !url.trim())}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </Box>

      {results?.length ? (
        <TableContainer>
          <Typography variant="h6" gutterBottom>
            CRUX Data
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'url'}
                    direction={sortColumn === 'url' ? sortDirection : 'asc'}
                    onClick={() => handleSort('url')}
                  >
                    URL
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'cls'}
                    direction={sortColumn === 'cls' ? sortDirection : 'asc'}
                    onClick={() => handleSort('cls')}
                  >
                    CLS
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'fcp'}
                    direction={sortColumn === 'fcp' ? sortDirection : 'asc'}
                    onClick={() => handleSort('fcp')}
                  >
                    FCP (ms)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'lcp'}
                    direction={sortColumn === 'lcp' ? sortDirection : 'asc'}
                    onClick={() => handleSort('lcp')}
                  >
                    LCP (ms)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'ttfb'}
                    direction={sortColumn === 'ttfb' ? sortDirection : 'asc'}
                    onClick={() => handleSort('ttfb')}
                  >
                    TTFB (ms)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'inp'}
                    direction={sortColumn === 'inp' ? sortDirection : 'asc'}
                    onClick={() => handleSort('inp')}
                  >
                    INP (ms)
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.url}</TableCell>
                  <TableCell>{result.cls}</TableCell>
                  <TableCell>{result.fcp}</TableCell>
                  <TableCell>{result.lcp}</TableCell>
                  <TableCell>{result.ttfb}</TableCell>
                  <TableCell>{result.inp}</TableCell>
                </TableRow>
              ))}
              {summary && (
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell>
                    <strong>Average</strong>
                  </TableCell>
                  <TableCell>{summary.avgCls}</TableCell>
                  <TableCell>{summary.avgFcp}</TableCell>
                  <TableCell>{summary.avgLcp}</TableCell>
                  <TableCell>{summary.avgTtfb}</TableCell>
                  <TableCell>{summary.avgInp}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
};

export default MultipleURLView;