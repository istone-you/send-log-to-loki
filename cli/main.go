package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "lokisend",
	Short: "Send logs to Grafana Loki",
	RunE: func(cmd *cobra.Command, args []string) error {
		message, _ := cmd.Flags().GetString("message")
		return sendLog(message)
	},
}



func sendLog(message string) error {
	lokiAddress := os.Getenv("LOKI_ADDRESS")
	lokiUsername := os.Getenv("LOKI_USERNAME")
	lokiPassword := os.Getenv("LOKI_PASSWORD")
	
	// ログエントリを作成
	logEntry := map[string]interface{}{
		"streams": []map[string]interface{}{
			{
				"stream": map[string]string{
					// ログのラベルを指定
					"source": "lokisend-cli",
				},
				"values": [][]string{
					{fmt.Sprintf("%d", time.Now().UnixNano()), message},
				},
			},
		},
	}

	// JSONにエンコード
	data, err := json.Marshal(logEntry)
	if err != nil {
		return err
	}

	// Lokiにログを送信
	req, err := http.NewRequest("POST", lokiAddress+"/loki/api/v1/push", bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	if lokiUsername != "" && lokiPassword != "" {
		req.SetBasicAuth(lokiUsername, lokiPassword)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("failed to send log to Loki: status code %d", resp.StatusCode)
	}

	fmt.Println("Log sent successfully")
	return nil
}

func main() {
	rootCmd.Flags().StringP("message", "m", "", "Log message to send")
	rootCmd.MarkFlagRequired("message")

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
