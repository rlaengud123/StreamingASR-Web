import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Switch,
  VStack,
} from "@chakra-ui/react";

import React from "react";

interface TranslationParamsBoxProps {
  translateFlag: boolean;
  setTranslateFlag: React.Dispatch<React.SetStateAction<boolean>>;
  srcLang: string;
  setSrcLang: React.Dispatch<React.SetStateAction<string>>;
}

const TranslationParamsBox: React.FC<TranslationParamsBoxProps> = ({
  translateFlag,
  setTranslateFlag,
  srcLang,
  setSrcLang,
}) => {
  return (
    <Box p={4}>
      <VStack spacing={4}>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="translate-flag" mb="0">
            Translate Flag:
          </FormLabel>
          <Switch
            id="translate-flag"
            isChecked={translateFlag}
            onChange={e => setTranslateFlag(!translateFlag)}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="src-lang">Source Language:</FormLabel>
          <Select
            id="src-lang"
            value={srcLang}
            onChange={e => setSrcLang(e.target.value)}
          >
            <option value="ko">Korean</option>
            <option value="en">English</option>
          </Select>
        </FormControl>
      </VStack>
    </Box>
  );
};

export default TranslationParamsBox;
