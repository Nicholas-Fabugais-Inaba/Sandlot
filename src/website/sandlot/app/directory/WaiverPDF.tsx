import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 20 },
  section: { margin: 10, padding: 10, fontSize: 14 },
  keyValue: { marginBottom: 5 }, // Style for key-value pairs
  listItem: { marginLeft: 10, marginBottom: 3 }, // Style for list items
});

const MyPDF = ({ data }: { data: Record<string, string | string[]> }) => (
  <Document title="WAIVERRRRR">
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {Object.entries(data).map(([key, value], index) => (
          <View key={index} style={styles.keyValue}>
            <Text style={{ fontWeight: 'bold' }}>{key}:</Text>
            {Array.isArray(value) ? (
              // Render as a list if the value is an array
              value.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.listItem}>
                  - {item}
                </Text>
              ))
            ) : (
              // Render as a single text if the value is a string
              <Text>{value}</Text>
            )}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default MyPDF;