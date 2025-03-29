import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 20 },
  section: { margin: 10, padding: 10, fontSize: 14 },
});

const MyPDF = ({ data }: { data: string }) => (
  <Document title="WAIVERRRRR">
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{data}</Text>
      </View>
    </Page>
  </Document>
);

export default MyPDF;